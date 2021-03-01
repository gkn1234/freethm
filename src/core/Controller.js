/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-01-13 16:19:27
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-01-26 16:09:23
 */
import Sound from 'pixi-sound'
import { AnimatedSprite, Sprite } from 'pixi.js'

import { Game } from '@/libs/index.js'
import GestureCatcher from './Gesture/GestureCatcher.js'
import MapData from './Map/MapData.js'
import Utils from './Utils.js'

// 游戏全局对象，游戏选项，谱面对象，资源图集
let game, gameConfig, sheet

// 单例对象键
const instanceKey = Symbol('instance')

export default class Controller {
  constructor (scene) {
    // 单例处理
    if (Controller[instanceKey]) {
      return Controller[instanceKey]
    }
    Controller[instanceKey] = this
    
    this.$scene = scene
    
    // 必要的数据获取
    game = new Game()
    gameConfig = game.getUsed('gameConfig')
    sheet = game.getUsed('sheet')
    // 激活工具类
    new Utils()
    
    this._init()
  }

  _init () {
    // 初始化按键容器
    this._initNoteContainer()

    // 初始化按键判定
    this.$gestureCatcher = new GestureCatcher(this)

    // 初始化谱面，也就是按键集合
    this.$map = new MapData()

    // 初始化基本信息，需要依赖谱面信息的bpm，时间等
    this._initBaseData()

    // 初始化声音
    console.log(game)
    this.$bgm = game.$app.loader.resources[gameConfig.bgm].sound
    this.$bgm.singleInstance = true
  }
  
  // 初始化按键容器
  _initNoteContainer () {
    const { canvasWidth, containerWidth, containerHeight, judgeToBottom, trueHeight, effHeight, affinePoint } = Utils.getPosData()

    // 背景封面
    let bgImage = new Sprite(game.$app.loader.resources[gameConfig.bgImage].texture)
    bgImage.width = containerWidth
    bgImage.height = containerHeight
    bgImage.alpha = gameConfig.bgImageAlpha
    this.$scene.addChild(bgImage)
    // 保存一下封面图URL
    this.bgImageSrc = gameConfig.bgImage
    
    // 按键容器，内部所有内容都会进行仿射变换，注意原点在容器底部中心(要注意容器在判定线以上)
    let container = new PIXI.projection.Container2d()
    container.position.set(canvasWidth / 2, trueHeight)
    // 对容器做仿射变化，起到3D转2D的效果
    container.proj.setAxisY(affinePoint, -1)
    // 加入舞台
    this.$scene.addChild(container)
    // 按键容器极其关键，单独标记
    this.$noteContainer = container
    
    // 容器皮肤
    const containerSkin = new PIXI.projection.Sprite2d(sheet.textures[gameConfig.containerSrc])
    containerSkin.anchor.set(0.5, 1)
    containerSkin.width = containerWidth * (trueHeight / containerHeight)
    containerSkin.height = effHeight
    this.$noteContainer.addChild(containerSkin)
    this._containerSkin = containerSkin

    // 判定线UI
    const judgeLine = new Sprite(sheet.textures[gameConfig.judgeSrc])
    judgeLine.width = containerWidth
    judgeLine.height = judgeToBottom
    judgeLine.anchor.set(0.5, 0)
    judgeLine.position.set(canvasWidth / 2, trueHeight)
    this.$scene.addChild(judgeLine)
    this._judgeLine = judgeLine

    // 轨道、判定线先隐藏起来
    this._hideNoteContainer()
  }

  // 初始化基本信息
  _initBaseData () {
    // 音乐bpm
    this.bpm = this.$map.bpm
    // 音乐持续时间
    this.bpmDuration = this.$map.duration
    // 长按保持时间，我们希望能够做多包容8分音符，所以这里传参为7分音符
    this.limitTime = Utils.getNoteDuration(7, this.bpm)
    // 按键miss的时间
    const { time } = Utils.getJudgeData(-1)
    this.missTime = time
  }

  // 显示按键轨道
  _showNoteContainer () {
    this._containerSkin.alpha = 1
    this._judgeLine.alpha = 1
  }
  // 隐藏按键轨道
  _hideNoteContainer () {
    this._containerSkin.alpha = 0
    this._judgeLine.alpha = 0
  }

  // 游戏开始前需要初始化的参数
  _startSettings () {
    const { timeBeforeStart, startDelay } = gameConfig
    // 设置起始时间戳
    this.curTime = timeBeforeStart * (-1)
    // 按键延迟时间
    this.startDelay = startDelay

    // 初始化需要判定的按键
    if (!this.$judgeNotes) { this.$judgeNotes = new Set() }
    this.$judgeNotes.clear()
    // 谱面指针回到开头
    this.$map.begin()

    // 游戏是否开始播放音频
    this._isMusicPlay = false

    // 当前的得分
    this.score = 0
  }

  // 游戏启动
  start (isAuto = false) {
    this._startSettings()
    this._showNoteContainer()

    // 游戏循环
    game.$app.ticker.add(this.onUpdate, this)
    // 启动手势判定
    this.$gestureCatcher.start()
  }

  // 游戏暂停
  pause () {
    game.$app.ticker.stop()
    this.$gestureCatcher.stop()
    this.$bgm.pause()
  }

  // 游戏恢复
  resume () {
    game.$app.ticker.start()
    this.$gestureCatcher.start()
    this.$bgm.resume()
  }

  // 游戏重开
  restart () {
    this._startSettings()

    game.$app.ticker.start()
    this.$gestureCatcher.start()
  }

  // 播放音乐
  _playMusic () {
    this._isMusicPlay = true
    this.$bgm.play()
  }

  // 每一帧的游戏逻辑
  onUpdate () {
    const delta = game.$app.ticker.elapsedMS
    this.curTime = this.curTime + delta
    // console.log(this.curTime, nowTimeStamp, deltaStamp)
    if (!this._isMusicPlay && this.curTime >= this.startDelay * (-1)) {
      // 过了延时时间后，播放BGM
      this._playMusic()
    }
    
    // 更新谱面指针
    const notes = this.$map.forward(this.curTime)
    notes.forEach((note) => {
      // 将当前时间的按键加入版面
      note.addToStage(this)
    })
    
    // 获取变速参数
    const speedChange = this.$map.getCurrentSpeed()
    this.$judgeNotes.forEach((child) => {
      // 再更新待判定的按键
      child.onUpdate(delta, speedChange)
    })
    
    // 进行一轮按键判定
    this.$gestureCatcher.judge()
  }
}