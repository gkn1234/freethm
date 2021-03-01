import { Game, Validator } from '@/libs/index.js'

import { mapValidator, speedChangeValidtor, posValidator, noteValidator } from './mapValidator.js'
import Utils from '../Utils.js'
import Tap from '../Note/Tap.js'

let game, mapData

// 单例对象键
const instanceKey = Symbol('instance')

export default class MapData {
  constructor () {
    // 单例处理
    if (MapData[instanceKey]) {
      return MapData[instanceKey]
    }
    MapData[instanceKey] = this
    
    game = new Game()
    mapData = game.getUsed('mapData')
    mapValidator.mount(mapData)
    
    this._init()
  }
  
  _init () {
    if (!Validator.isObject(mapData)) {
      throw new Error('Map data must be an object!')
    }

    this.bpm = mapData.bpm
    this.title = mapData.title
    this.difficulty = mapData.difficulty
    
    // 处理变速对象
    this._resolveSpeedChange()
    // 处理谱面
    this._resolveNotes()
  }
  
  _resolveSpeedChange () {
    // 第一轮审查，顺带检验变速对象的合法性
    this.speedChanges = mapData.speedChanges.filter((item) => {
      speedChangeValidtor.mount(item)
      // 验证器处理后，如果关键数据非法无法构成合法的变速对象，则关键参数是NaN，或者变速的结尾时间小于变速的起始时间，根据这一点进行过滤
      return !Number.isNaN(item.speed) && !Number.isNaN(item.start) && !Number.isNaN(item.end) && item.start < item.end
    })
    
    // 按照时间升序排序
    this.speedChanges.sort((a, b) => {
      return a.start - b.start
    })
    
    // 第二轮审查，后一个变速的end必须小于前一个变速的start，否则将强制调整
    for (let i = 0; i < this.speedChanges.length; i++) {
      let speedObj = this.speedChanges[i]
      if (i > 0 && speedObj.start < this.speedChanges[i - 1].end) {
        this.speedChanges[i - 1].end = speedObj.start
      }
    }
  }
  
  _resolveNotes () {
    const notes = Validator.isArray(mapData.notes) ? mapData.notes : []
    this.notes = []
    
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
      
      // 验证器处理后，如果关键数据非法无法构成谱面对象，则type会是null，time会是NaN，根据这一点进行过滤
      if (!notes[i].type || Number.isNaN(notes[i].time)) { continue }
      
      let note
      switch (notes[i].type) {
        case 'Tap':
          note = new Tap(notes[i], this.speedChanges)
          break
        case 'Slide':
          break
        case 'Swipe':
          break
        case 'Hold':
          break
      }
      this.notes.push(note)
    }
    
    // 最后按照时间升序进行排序
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