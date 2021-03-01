/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-01-13 16:22:39
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-01-26 16:03:52
 */
import { Pool } from '@/libs/index.js'
import TapItem from './TapItem.js'
import Utils from '../Utils.js'

// Tap按键，也是所有按键基类，此类主要描述谱面如何作为一个精灵实体在画布上运动
export default class Tap extends TapItem {
  constructor (note = {}, speedChanges = []) {
    super(note, speedChanges)
  }
  
  // 谱面进入舞台，controller为舞台所在的游戏逻辑控制器
  addToStage (controller) {
    this._controller = controller
    
    // 加入主舞台之前必须创建精灵
    this._initSprite()
    
    // 加入判定列表
    this._controller.$judgeNotes.add(this)
    // 加入场景
    this._controller.$noteContainer.addChild(this._sprite)
  }
  
  // 初始化精灵实体
  _initSprite () {
    this._sprite = Pool.get(this.textureName, PIXI.projection.Sprite2d, this.texture)
    this._sprite.width = this.width
    this._sprite.height = this.height
    
    // 初始锚点中心
    this._sprite.anchor.set(0.5, 0)
    
    this._sprite.x = this.x
    this._sprite.y = this.y
  }
  
  // 每一帧的变化，delta为帧间隔，speedChange为变速参数
  onUpdate (delta, speedChange = 1) {
    const time = this._controller.curTime
    delta = time - delta < this.start ? time - this.start : delta
    
    const { vStandard } = Utils.getMoveData()
    const v = speedChange * vStandard
    const s = v * delta
    this._sprite.y = this._sprite.y + s
    // console.log(this._sprite.y)
    
    // 落到判定线
    if (this._sprite.y >= 0 && !this.daoda) {
      console.log('到达', this.type, time, this._sprite.y, this._sprite.x)
      this.daoda = true
    }
    
    // 是否超出判定时间
    if (time - this.time > this._controller.missTime) {
      // 移除按键
      this.removeFromStage()
    }
  }
  
  // 从舞台移除
  removeFromStage () {
    this._controller.$judgeNotes.delete(this)
    this._controller.$noteContainer.removeChild(this._sprite)
    this._controller = null
  }
}