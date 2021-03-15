/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-05 10:46:33
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-08 17:59:24
 */
import { Container } from 'pixi.js'
import { Projection2d } from './Projection2d.js'
import { TRANSFORM_STEP } from './basic/AbstractProjection.js'

/**
 * @warn 依赖this，是非常危险的方法
 */
export function container2dWorldTransform () {
  return this.proj.affine ? this.transform.worldTransform : this.proj.world
}

export class Container2d extends Container {
  proj = {}

  constructor () {
    super()
    this.proj = new Projection2d(this.transform)
  }

  /**
   * @override
   * @param {PIXI.Point} position 
   * @param {PIXI.DisplayObject} from 
   * @param {PIXI.Point} point 
   * @param {Boolean} skipUpdate 
   * @param {TRANSFORM_STEP} step
   * @returns {PIXI.Point}
   */
  toLocal (position, from, point, skipUpdate = false, step = TRANSFORM_STEP.ALL) {
    if (from) {
      position = from.toGlobal(position, point, skipUpdate)
    }

    if (!skipUpdate) {
      this._recursivePostUpdateTransform()
    }

    if (step >= TRANSFORM_STEP.PROJ) {
      if (!skipUpdate) {
        this.displayObjectUpdateTransform()
      }
      if (this.proj.affine) {
        return this.transform.worldTransform.applyInverse(position, point)
      }
      return this.proj.world.applyInverse(position, point)
    }

    if (this.parent) {
      point = this.parent.worldTransform.applyInverse(position, point)
    }
    else {
      point.copyFrom(position)
    }

    if (step === TRANSFORM_STEP.NONE) {
      return point
    }

    return this.transform.localTransform.applyInverse(point, point)
  }

  /**
   * @override
   */
  get worldTransform() {
    return this.proj.affine ? this.transform.worldTransform : this.proj.world
  }
}

export let container2dToLocal = Container2d.prototype.toLocal