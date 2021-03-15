/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-08 11:12:14
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-08 18:36:14
 */
const GESTURE_NAME = {
  // 初始化
  start: 'start',
  // 基本事件
  over: 'over',
  out: 'out',
  down: 'down',
  up: 'up',
  upOut: 'upOut',
  move: 'move',
  // 在内部移动
  moveIn: 'moveIn',
  // 在内部滑动(按住鼠标)
  slideIn: 'slideIn',
  
  // 拖拽事件
  dragStart: 'dragStart',
  dragEnd: 'dragEnd',
  dragMoveBefore: 'dragMoveBefore',
  dragMove: 'dragMove'
}

class Gesture {
  // 手势基本属性
  // 手势对象
  target = null
  // 当前触发的事件名称
  name = GESTURE_NAME.none
  // 当前触发事件原始对象
  e = null
  // 是否激活
  isActive = false

  // 手势特殊信号
  // 是否在对象范围内
  _isInside = false
  // 是否在对象范围内按住鼠标
  _isDownInside = false

  // 各种手势事件触发
  _overHandler = null
  _outHandler = null
  _downHandler = null
  _upHandler = null
  _upOutHandler = null
  _moveHandler = null

  /**
   * 各种手势事件回调：on + 大驼峰事件名
   * 任何手势事件的回调(泛用回调)：onGesture
   * 此处不进行显式定义
   */

  /**
   * 最基本的手势对象
   * @param {PIXI.DisplayObject} target 手势对象作用目标
   * @param {Object<Function>} callbacks 回调函数集合，每一个key必须为有效的手势回调：on + 大驼峰事件名
   */
  constructor (target, callbacks = {}) {
    this.target = target
    // 初始化回调函数
    this._initCallbacks(callbacks)
    // 绑定手势
    this.active()
  }

  // 初始化回调函数
  _initCallbacks (callbacks = {}) {
    if (!callbacks || typeof callbacks !== 'object') { return }

    for (let key in callbacks) {
      if (key.match(/on[A-Z]\w*/)) {
        // 符合规则的回调名称
        this[key] = callbacks[key]
      }
      else {
        console.error(`Callback key ${key} is invalid!`)
      }
    }
  }

  // 绑定所有手势对象
  active () {
    // 避免重复绑定
    if (this.isActive) { return }

    this.isActive = true
    this.target.interactive = true

    this._overHandler = this.overHandler.bind(this)
    this._outHandler = this.outHandler.bind(this)
    this._downHandler = this.downHandler.bind(this)
    this._upHandler = this.upHandler.bind(this)
    this._upOutHandler = this.upOutHandler.bind(this)
    this._moveHandler = this.moveHandler.bind(this)

    this.target.on('pointerover', this._overHandler)
    this.target.on('pointerout', this._outHandler)
    this.target.on('pointerdown', this._downHandler)
    this.target.on('pointerup', this._upHandler)
    this.target.on('pointerupoutside', this._upOutHandler)
    this.target.on('pointermove', this._moveHandler)

    // 立即触发一次
    this.trigger(GESTURE_NAME.start)
  }

  // 解绑所有手势对象
  release () {
    if (!this.isActive) { return }

    this.target.off('pointerover', this._overHandler)
    this.target.off('pointerout', this._outHandler)
    this.target.off('pointerdown', this._downHandler)
    this.target.off('pointerup', this._upHandler)
    this.target.off('pointerupoutside', this._upOutHandler)
    this.target.off('pointermove', this._moveHandler)
    
    this.isActive = false
  }

  // 触发手势事件
  trigger (name, e, ...args) {
    if (!this.isActive) { return }

    // 更新事件名和原始事件对象
    this.name = name
    this.e = e ? e : this.e

    // 返回结果
    let res = undefined

    // 触发泛用的回调函数
    if (typeof this.onGesture === 'function') {
      res = this.onGesture(this, ...args)
    }

    // on + 大驼峰事件名，构成回调函数名称
    const callbackName = 'on' + name.slice(0, 1).toUpperCase + name.slice(1)
    // 触发专门的回调函数，专门回调函数的返回值在非undefined(有返回值)的情况下会覆盖泛用函数的返回值，作为真正的返回结果
    if (typeof this[callbackName] === 'function') {
      const callbackRes = this[callbackName](this, ...args)
      if (callbackRes !== undefined) { res = callbackRes }
    }

    return res
  }

  overHandler (e) {
    this._isInside = true
    this.trigger(GESTURE_NAME.over, e)
  }

  outHandler (e) {
    this._isInside = false
    this.trigger(GESTURE_NAME.out, e)
  }

  downHandler (e) {
    this._isDownInside = true
    this.trigger(GESTURE_NAME.down, e)
  }

  upHandler (e) {
    this._isDownInside = false
    this.trigger(GESTURE_NAME.up, e)
  }

  upOutHandler (e) {
    this._isInside = false
    this._isDownInside = false
    this.trigger(GESTURE_NAME.upOut, e)
  }

  moveHandler (e) {
    this.trigger(GESTURE_NAME.move, e)
    if (this._isInside) {
      this.trigger(GESTURE_NAME.moveIn, e)
      if (this._isDownInside) {
        this.trigger(GESTURE_NAME.slideIn, e)
      }
    }
  }

  /**
   * 将目标世界绝对坐标转换为相对坐标
   */
  resolveGlobalPos (pos) {
    let relativeEl = this.target.parent ? this.target.parent : this.target
    return relativeEl.toLocal(pos)
  }
}

Gesture.GESTURE_NAME = GESTURE_NAME

export {
  GESTURE_NAME,
  Gesture
}