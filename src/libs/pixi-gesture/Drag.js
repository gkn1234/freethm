/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-08 12:07:44
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-08 18:36:30
 */
import { GESTURE_NAME, Gesture } from './Gesture.js'

export class Drag extends Gesture {
  // 当前的手势id
  _id = null
  // 上一次拖拽时的坐标
  _dragPrevPos = null

  constructor (target, callbacks) {
    super(target, callbacks)
  }

  /**
   * @override
   */
  downHandler (e) {
    super.downHandler(e)

    this._id = e.data.identifier
    this._dragPrevPos = this.resolveGlobalPos(e.data.global)
    this.trigger(GESTURE_NAME.dragStart, e)
  }

  /**
   * @override
   */
  upHandler (e) {
    super.upHandler(e)
    this._stopDrag(e)
  }

  /**
   * @override
   */
  upOutHandler (e) {
    super.upOutHandler(e)
    this._stopDrag(e)
  }

  /**
   * @override
   */
  moveHandler (e) {
    super.moveHandler(e)

    // 避免多点触控对拖拽的干扰
    if (e.data.identifier !== this._id) { return }

    // 计算移动量
    const pos = this.resolveGlobalPos(e.data.global)
    const dx = pos.x - this._dragPrevPos.x
    const dy = pos.y - this._dragPrevPos.y

    // 在真正执行移动前，触发dragMoveBefore拦截事件
    const res = this.trigger(GESTURE_NAME.dragMoveBefore, e, { dx, dy })
    // 当dragMoveBefore事件的回调返回false或者null，代表拖拽拦截，不对拖拽坐标进行更新
    if (res === false || res === null) { return }

    // 拦截事件后如果没有进行阻断，进行按照预期移动目标
    this.move(dx, dy)
  }

  /**
   * 移动目标
   */
  move (dx, dy) {
    // 移动目标
    this.target.x += dx
    this.target.y += dy
    // 及时更新上一次触发事件的坐标
    this._dragPrevPos.x += dx
    this._dragPrevPos.y += dy
    this.trigger(GESTURE_NAME.dragMove)
  }

  // 停止
  _stopDrag (e) {
    if (e.data.identifier === this._id) {
      this._id = null
      this.trigger(GESTURE_NAME.dragEnd, e)
    }
  }
}