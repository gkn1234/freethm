/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-05 11:08:11
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-08 18:01:50
 */
import { Transform } from 'pixi.js'
import { AbstractProjection } from './AbstractProjection.js'
import { AFFINE } from '../Matrix2d.js'

/**
 * pixi-projection 内部的黑客变换方法
 * @warn 有一个恶劣的this需要严重注意
 * @param {PIXI.Transform} parentTrans 
 */
function transformHack (parentTrans) {
  let { localTransform, worldTransform, proj } = this
  const scaleAfterAffine = proj.scaleAfterAffine && proj.affine >= 2

  if (this._localID !== this._currentLocalID) {
    // get the matrix values of the displayobject based on its transform properties..
    if (scaleAfterAffine) {
      localTransform.a = this._cx
      localTransform.b = this._sx
      localTransform.c = this._cy
      localTransform.d = this._sy

      localTransform.tx = this.position._x
      localTransform.ty = this.position._y
    }
    else {
      localTransform.a = this._cx * this.scale._x
      localTransform.b = this._sx * this.scale._x
      localTransform.c = this._cy * this.scale._y
      localTransform.d = this._sy * this.scale._y

      localTransform.tx = this.position._x - ((this.pivot._x * localTransform.a) + (this.pivot._y * localTransform.c))
      localTransform.ty = this.position._y - ((this.pivot._x * localTransform.b) + (this.pivot._y * localTransform.d))
    }

    this._currentLocalID = this._localID
    // force an update..
    proj._currentProjID = -1
  }

  if (proj._currentProjID !== proj._projID) {
    proj._currentProjID = proj._projID
    proj.updateLocalTransform(localTransform)
    this._parentID = -1
  }

  if (this._parentID !== parentTrans._worldID) {
    const parentProj = parentTrans.proj
    if (parentProj && !parentProj._affine) {
      proj.world.setToMult(parentProj.world, proj.local);
    }
    else {
      proj.world.setToMultLegacy(parentTrans.worldTransform, proj.local);
    }

    proj.world.copyTo(worldTransform, proj._affine, proj.affinePreserveOrientation);

    if (scaleAfterAffine) {
      worldTransform.a *= this.scale._x
      worldTransform.b *= this.scale._x
      worldTransform.c *= this.scale._y
      worldTransform.d *= this.scale._y

      worldTransform.tx -= ((this.pivot._x * worldTransform.a) + (this.pivot._y * worldTransform.c))
      worldTransform.ty -= ((this.pivot._x * worldTransform.b) + (this.pivot._y * worldTransform.d))
    }
    this._parentID = parentTrans._worldID
    this._worldID++
  }
}

export class LinearProjection extends AbstractProjection {
  /**
   * @param {PIXI.Transform} legacy 
   * @param {Boolean} enabled
   */
  constructor (legacy, enabled) {
    super(legacy, enabled)
  }

  _projID = 0
  _currentProjID = -1
  _affine = AFFINE.NONE
  affinePreserveOrientation = false
  scaleAfterAffine = true

  set affine(val) {
    this._affine = val
    this._currentProjID = -1
    this.legacy._currentLocalID = -1
  }
  get affine() { return this._affine }

  /**
   * @override
   */
  set enabled (val) {
    this._enabled = val
    if (val) {
      this.legacy.updateTransform = transformHack
    }
    else {
      this.legacy.updateTransform = Transform.prototype.updateTransform
    }
    this.legacy._parentID = -1
  }

  /**
   * @override
   */
  clear () {
    this._currentProjID = -1
    this._projID = 0
  }
}