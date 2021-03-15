import { Validator } from '@cmjs/utils'

import { noteValidator, speedChangeValidtor } from './mapValidator.js'
import { NOTE_TYPES } from '../Utils.js'
import Tap from '../note/Tap.js'

let game, mapData

// 单例对象键
const instanceKey = Symbol('instance')

export default class MapData {
  // 实例属性
  // 游戏对象实例
  _game = null
  // 游戏配置，相当于this._game.$data.config
  _gameConfig = null
  // 原始谱面数据
  _mapData = {}
  
  // 一分钟节拍数
  bpm = 150
  // 歌曲标题
  title = ''
  // 歌曲难度说明
  difficulty = ''
  // 歌曲资源src
  bgm = ''
  // 歌曲封面src
  bgmImage = ''
  // 变速对象哈希表，键值是变速对象的id
  speedChanges = {}
  // 谱面按键对象列表
  notes = []

  constructor (game) {
    this._game = game
    this._config = game.$data.config
    this._mapData = game.$data.map

    // 初始化
    this._init()

    // 挂载全新的谱面数据到游戏对象
    game.$data.map = this
  }
  
  _init () {
    const mapData = this._mapData
    Object.assign(this, mapData)
    
    // 处理变速对象
    this._resolveSpeedChange()
    // 处理谱面
    this._resolveNotes()
  }
  
  // 解析变速对象
  _resolveSpeedChange () {
    for (let key in this._mapData.speedChanges) {
      let speedChange = this._mapData.speedChanges[key]
      speedChangeValidtor.mount(speedChange)
      // 如果是不合法的变速数据，关键参数会被校验器置为null
      if (speedChange.speed !== null && speedChange.start !== null && speedChange.end !== null && speedChange.start < speedChange.end) {
        // 合法变速存入哈希表
        this.speedChanges[key] = speedChange
      }
    }
  }
  
  _resolveNotes () {
    const mapData = this._mapData
    const notes = Validator.isArray(mapData.notes) ? mapData.notes : []
    
    for (let i = 0; i < notes.length; i++) {
      if (!Validator.isObject(notes[i])) { continue }
      
      noteValidator.mount(notes[i])
      /* 这段逻辑放入HoldItem比较好
      if (notes[i].end) {
        // Hold类型按键具有end对象，指定面条结束处的轨道位置，对此进行修正
        posValidator.mount(notes[i].end)
        notes[i].end.key = notes[i].key
      }
      */
      
      // 验证器处理后，如果关键数据非法无法构成谱面对象，如type = null，time = null，根据这一点进行过滤
      if (!notes[i].type || !notes[i].time) { continue }
      
      switch (notes[i].type) {
        case NOTE_TYPES.Tap:
          this.notes.push(new Tap(notes[i], this.speedChanges, this._game))
          break
        case NOTE_TYPES.Slide:
          break
        case NOTE_TYPES.Swipe:
          break
        case NOTE_TYPES.Hold:
          break
      }
    }
    
    // 最后按照所有按键的时间升序进行排序
    this.notes.sort((a, b) => {
      return a.start - b.start
    })
  }
  
  
  // 将谱面指针与变速指针均置为开头
  begin () {
    this._noteIndex = 0
    this._speedIndex = 0
  }
  
  // 获取下一个谱面对象
  _nextNote () {
    return this._noteIndex + 1 >= this.notes.length ? null : this.notes[this._noteIndex + 1]
  }
  
  // 获取下一个变速对象
  _nextSpeed () {
    return this._speedIndex + 1 >= this.speedChanges.length ? null : this.speedChanges[this._speedIndex + 1]
  }
  
  // 以当前时间触发谱面指针与变速指针更新，返回需要下落的所有按键
  forward (time) {
    let res = []
    
    let note = this.notes[this._noteIndex]
    // 更新谱面指针，计算需要下落的按键
    while (note && time >= note.start) {
      res.push(note)
      this._noteIndex++
      note = this._nextNote()
    }
    
    // 更新变速指针
    let speed = this._nextSpeed()
    while (speed && time >= speed.start && time <= speed.end) {
      this._speedIndex++
      speed = this._nextSpeed()
    }
    
    return res
  }
  
  // 获取当前变速参数
  getCurrentSpeed () {
    return this.speedChanges.length === 0 ? 1 : this.speedChanges[this._speedIndex].speed
  }
}