/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-05 10:55:40
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-08 17:50:13
 */
// 枚举，变换步骤
const TRANSFORM_STEP = {
  NONE: 0,
  // POS: 1,
  // ROT: 2,
  // SCALE: 3,
  // PIVOT: 4,
  BEFORE_PROJ: 4,
  PROJ: 5,
  // POS_2: 6,
  // ROT_2: 7,
  // SCALE_2: 8,
  // PIVOT_2: 9,
  ALL: 9
}

class AbstractProjection {
  _enabled = false
  // 继承变换信息
  legacy = null

  /**
   * @param {PIXI.Transform} legacy 
   * @param {Boolean} enabled
   */
  constructor (legacy, enabled = true) {
    this.legacy = legacy
    this.enabled = enabled ? true : false

    // sorry for hidden class, it would be good to have special projection field in official pixi
    this.legacy.proj = this
  }

  get enabled () { return this._enabled }
  set enabled (val) { this._enabled = val }

  clear () {}
}

AbstractProjection.TRANSFORM_STEP = TRANSFORM_STEP

export {
  TRANSFORM_STEP,
  AbstractProjection
}