/*
 * @Author: your name
 * @Date: 2021-01-25 09:47:59
 * @LastEditTime: 2021-01-25 10:23:50
 * @LastEditors: Guo Kainan
 * @Description: In User Settings Edit
 * @FilePath: \free-rhythm\src\core\Gesture\GestureCatcher.js
 */
import { Sprite } from 'pixi.js'

import { Game, Event } from '@/libs/index.js'
import Utils from '../Utils.js'

// 游戏全局对象，游戏选项，谱面对象，资源图集
let game, gameConfig, sheet

// 单例对象键
const instanceKey = Symbol('instance')

export default class GestureCatcher {
  constructor (controller) {
    // 单例处理
    if (GestureCatcher[instanceKey]) {
      return GestureCatcher[instanceKey]
    }
    GestureCatcher[instanceKey] = this

    // 必要的数据获取
    game = new Game()
    gameConfig = game.getUsed('gameConfig')
    sheet = game.getUsed('sheet')

    this._controller = controller
    // 手势集合Map，用事件的id作为key，事件对象为value
    this._gestures = new Map()
    // 初始化事件对象
    this.$event = new Event()

    // 是否启用手势，用于暂停
    this._isEnabled = true

    this._init()
  }

  _init () {
    // 划分PC端和移动端，PC端键盘判定，移动端手势判定
    this._mobileActivate()
  }

  _mobileActivate () {
    const { containerWidth, trueHeight, judgeAreaSize } = Utils.getPosData()
    // 生成判定区域 测试纹理 Game.loader.resources['/img/tap.png'].texture
    let judgeArea = new Sprite()
    judgeArea.width = containerWidth
    judgeArea.height = judgeAreaSize
    judgeArea.y = trueHeight - judgeAreaSize / 2
    judgeArea.interactive = true
    this._controller.$scene.addChild(judgeArea)
    
    judgeArea.on('pointerdown', this._downHandler, this)
    judgeArea.on('pointermove', this._moveHandler, this)
    judgeArea.on('pointerup', this._upHandler, this)
    judgeArea.on('pointerout', this._outHandler, this)
  }

  
  // pointerdown回调
  _downHandler (e) {
    // down为一个手势的开始，创建一个手势对象
    let gesture = new Gesture(e.data.identifier, this)
    // 手势对象加入down事件
    gesture.down(e)
    // 加入列表
    this._gestures.set(e.data.identifier, gesture)
  }
  
  // pointermove回调
  _moveHandler (e) {
    const gesture = this._gestures.get(e.data.identifier)
    if (!gesture) {
      return
    }
    
    gesture.move(e)
  }
  
  // pointerup回调
  _upHandler (e) { 
    const gesture = this._gestures.get(e.data.identifier)
    if (!gesture) {
      return
    }
    
    gesture.up(e)
  }
  
  // 手势移出判定区
  _outHandler (e) {
    const gesture = this._gestures.get(e.data.identifier)
    if (!gesture) {
      return
    }
    gesture.out(e)
  }

  // 停止手势判定
  stop () {
    this._isEnabled = false
  }
  
  // 启动手势判定
  start () {
    this._isEnabled = true
  }

  // 绑定事件
  on (key, handler = () => {}) {
    this.$event.on(key, handler)
  }

  // 触发事件
  trigger (key) {
    this.$event.trigger(key)
  }

  // 进行判定
  judge () {
    
  }
}
