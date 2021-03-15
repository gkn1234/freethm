/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-05 11:13:59
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-05 16:04:49
 */
import { Point } from 'pixi.js'

const AFFINE = {
  NONE: 0,
  FREE: 1,
  AXIS_X: 2,
  AXIS_Y: 3,
  POINT: 4,
  AXIS_XR: 5
}

// 3阶单位矩阵
const mat3id = [1, 0, 0, 0, 1, 0, 0, 0, 1]

// 是否为合法数字
function isNum (val) {
  return typeof val === 'number' && !Number.isNaN(val) && val !== Infinity && val !== -Infinity
}
// 是否为变换矩阵数组
function isMat3 (arr) {
  return Array.isArray(arr) && arr.length === 9 && arr.every(item => isNum(item))
}

/**
 * 2d变化矩阵
 * |a, c, tx|
 * |b, d, ty|
 * |0, 0, z|
 * mat3 = [a, b, 0, c, d, 0, tx, ty, z]
 */
class Matrix2d {
  // A default (identity) matrix
  static IDENTITY = new Matrix2d()
  // A temp matrix
  static TEMP_MATRIX = new Matrix2d()

  mat3 = new Float64Array(mat3id)

  constructor (arr = []) {
    if (isMat3(arr)) {
      this.mat3 = new Float64Array(arr)
    }
  }
  
  get a () { return this.mat3[0] / this.mat3[8] }
  set a (val) { this.mat3[0] = val * this.mat3[8] }
  get b () { return this.mat3[1] / this.mat3[8] }
  set b (val) { this.mat3[1] = val * this.mat3[8] }
  get c () { return this.mat3[3] / this.mat3[8] }
  set c (val) { this.mat3[3] = val * this.mat3[8] }
  get d () { return this.mat3[4] / this.mat3[8] }
  set d (val) { this.mat3[4] = val * this.mat3[8] }
  get tx () { return this.mat3[6] / this.mat3[8] }
  set tx (val) { this.mat3[6] = val * this.mat3[8] }
  get ty () { return this.mat3[7] / this.mat3[8] }
  set ty (val) { this.mat3[7] = val * this.mat3[8] }

  set (a, b, c, d, tx, ty) {
    let mat3 = this.mat3;
    mat3[0] = a
    mat3[1] = b
    mat3[2] = 0
    mat3[3] = c
    mat3[4] = d
    mat3[5] = 0
    mat3[6] = tx
    mat3[7] = ty
    mat3[8] = 1
    return this
  }

  toArray (transpose = false) {
    const mat3 = this.mat3
    return transpose ? new Float32Array([mat3[0], mat3[1], mat3[2], mat3[3], mat3[4], mat3[5], mat3[6], mat3[7], mat3[8]]) :
      new Float32Array([mat3[0], mat3[3], mat3[6], mat3[1], mat3[4], mat3[7], mat3[2], mat3[5], mat3[8]])
  }

  /**
   * @returns {PIXI.Point}
   */
  apply (pos, newPos) {
    newPos = newPos || new Point()

    const mat3 = this.mat3
    const { x, y } = pos

    let z = 1.0 / (mat3[2] * x + mat3[5] * y + mat3[8])
    newPos.x = z * (mat3[0] * x + mat3[3] * y + mat3[6])
    newPos.y = z * (mat3[1] * x + mat3[4] * y + mat3[7])
    return newPos
  }

  translate (tx, ty) {
    let mat3 = this.mat3
    mat3[0] += tx * mat3[2]
    mat3[1] += ty * mat3[2]
    mat3[3] += tx * mat3[5]
    mat3[4] += ty * mat3[5]
    mat3[6] += tx * mat3[8]
    mat3[7] += ty * mat3[8]
    return this
  }

  scale (x, y) {
    let mat3 = this.mat3
    mat3[0] *= x
    mat3[1] *= y
    mat3[3] *= x
    mat3[4] *= y
    mat3[6] *= x
    mat3[7] *= y
    return this
  }

  scaleAndTranslate (scaleX, scaleY, tx, ty) {
    let mat3 = this.mat3
    mat3[0] = scaleX * mat3[0] + tx * mat3[2]
    mat3[1] = scaleY * mat3[1] + ty * mat3[2]
    mat3[3] = scaleX * mat3[3] + tx * mat3[5]
    mat3[4] = scaleY * mat3[4] + ty * mat3[5]
    mat3[6] = scaleX * mat3[6] + tx * mat3[8]
    mat3[7] = scaleY * mat3[7] + ty * mat3[8]
  }

  /**
   * @returns {PIXI.Point}
   */
  applyInverse (pos, newPos) {
    newPos = newPos || new Point()

    const a = this.mat3
    const { x, y } = pos

    const a00 = a[0], a01 = a[3], a02 = a[6],
      a10 = a[1], a11 = a[4], a12 = a[7],
      a20 = a[2], a21 = a[5], a22 = a[8]

    let newX = (a22 * a11 - a12 * a21) * x + (-a22 * a01 + a02 * a21) * y + (a12 * a01 - a02 * a11)
    let newY = (-a22 * a10 + a12 * a20) * x + (a22 * a00 - a02 * a20) * y + (-a12 * a00 + a02 * a10)
    let newZ = (a21 * a10 - a11 * a20) * x + (-a21 * a00 + a01 * a20) * y + (a11 * a00 - a01 * a10)

    newPos.x = newX / newZ
    newPos.y = newY / newZ

    return newPos
  }

  invert () {
    const a = this.mat3;

    const a00 = a[0], a01 = a[1], a02 = a[2],
      a10 = a[3], a11 = a[4], a12 = a[5],
      a20 = a[6], a21 = a[7], a22 = a[8],
      b01 = a22 * a11 - a12 * a21,
      b11 = -a22 * a10 + a12 * a20,
      b21 = a21 * a10 - a11 * a20

    // Calculate the determinant
    let det = a00 * b01 + a01 * b11 + a02 * b21
    if (!det) { return this }
    det = 1.0 / det

    a[0] = b01 * det
    a[1] = (-a22 * a01 + a02 * a21) * det
    a[2] = (a12 * a01 - a02 * a11) * det
    a[3] = b11 * det
    a[4] = (a22 * a00 - a02 * a20) * det
    a[5] = (-a12 * a00 + a02 * a10) * det
    a[6] = b21 * det
    a[7] = (-a21 * a00 + a01 * a20) * det
    a[8] = (a11 * a00 - a01 * a10) * det

    return this
  }

  identity () {
    this.mat3 = new Float64Array(mat3id)
    return this
  }

  clone () {
    return new Matrix2d(this.mat3)
  }

  /**
   * @param {Matrix2d} matrix 
   */
  copyTo2dOr3d (matrix) {
    const mat3 = this.mat3
    let ar2 = matrix.mat3
    ar2[0] = mat3[0]
    ar2[1] = mat3[1]
    ar2[2] = mat3[2]
    ar2[3] = mat3[3]
    ar2[4] = mat3[4]
    ar2[5] = mat3[5]
    ar2[6] = mat3[6]
    ar2[7] = mat3[7]
    ar2[8] = mat3[8]
    return matrix
  }

  /**
   * legacy method, change the values of given pixi matrix
   * @param {PIXI.Matrix} matrix 
   */
  copyTo (matrix, affine = AFFINE.AXIS_X, preserveOrientation = false) {
    const mat3 = this.mat3
    const d = 1.0 / mat3[8]
    const tx = mat3[6] * d, ty = mat3[7] * d
    matrix.a = (mat3[0] - mat3[2] * tx) * d
    matrix.b = (mat3[1] - mat3[2] * ty) * d
    matrix.c = (mat3[3] - mat3[5] * tx) * d
    matrix.d = (mat3[4] - mat3[5] * ty) * d
    matrix.tx = tx
    matrix.ty = ty

    if (affine >= 2) {
      let D = matrix.a * matrix.d - matrix.b * matrix.c
      if (!preserveOrientation) {
        D = Math.abs(D)
      }
      if (affine === AFFINE.POINT) {
        D = D > 0 ? 1 : -1
        matrix.a = D
        matrix.b = 0
        matrix.c = 0
        matrix.d = D
      } 
      else if (affine === AFFINE.AXIS_X) {
        D /= Math.sqrt(matrix.b * matrix.b + matrix.d * matrix.d)
        matrix.c = 0
        matrix.d = D
      }
      else if (affine === AFFINE.AXIS_Y) {
        D /= Math.sqrt(matrix.a * matrix.a + matrix.c * matrix.c)
        matrix.a = D
        matrix.c = 0
      }
      else if (affine === AFFINE.AXIS_XR) {
        matrix.a =  matrix.d * D
        matrix.c = -matrix.b * D
      }
    }
    return matrix
  }

  /**
   * legacy method, change the values of given pixi matrix
   * @param {PIXI.Matrix} matrix 
   */
  copyFrom (matrix) {
    let mat3 = this.mat3
    mat3[0] = matrix.a
    mat3[1] = matrix.b
    mat3[2] = 0
    mat3[3] = matrix.c
    mat3[4] = matrix.d
    mat3[5] = 0
    mat3[6] = matrix.tx
    mat3[7] = matrix.ty
    mat3[8] = 1.0
    return this
  }

  /**
   * PIXI matrix to lagacy
   * @param {PIXI.Matrix} pt 
   * @param {Matrix2d} lt 
   */
  setToMultLegacy(pt, lt) {
    let out = this.mat3
    const b = lt.mat3

    const a00 = pt.a, a01 = pt.b,
      a10 = pt.c, a11 = pt.d,
      a20 = pt.tx, a21 = pt.ty,
      b00 = b[0], b01 = b[1], b02 = b[2],
      b10 = b[3], b11 = b[4], b12 = b[5],
      b20 = b[6], b21 = b[7], b22 = b[8]


    out[0] = b00 * a00 + b01 * a10 + b02 * a20
    out[1] = b00 * a01 + b01 * a11 + b02 * a21
    out[2] = b02

    out[3] = b10 * a00 + b11 * a10 + b12 * a20
    out[4] = b10 * a01 + b11 * a11 + b12 * a21
    out[5] = b12

    out[6] = b20 * a00 + b21 * a10 + b22 * a20
    out[7] = b20 * a01 + b21 * a11 + b22 * a21
    out[8] = b22

    return this
  }

  /**
   * lagacy matrix to PIXI
   * @param {Matrix2d} pt 
   * @param {PIXI.Matrix} lt 
   */
  setToMultLegacy2(pt, lt) {
    let out = this.mat3
    const a = pt.mat3

    const a00 = a[0], a01 = a[1], a02 = a[2],
      a10 = a[3], a11 = a[4], a12 = a[5],
      a20 = a[6], a21 = a[7], a22 = a[8],
      b00 = lt.a, b01 = lt.b,
      b10 = lt.c, b11 = lt.d,
      b20 = lt.tx, b21 = lt.ty


    out[0] = b00 * a00 + b01 * a10
    out[1] = b00 * a01 + b01 * a11
    out[2] = b00 * a02 + b01 * a12

    out[3] = b10 * a00 + b11 * a10
    out[4] = b10 * a01 + b11 * a11
    out[5] = b10 * a02 + b11 * a12

    out[6] = b20 * a00 + b21 * a10 + a20
    out[7] = b20 * a01 + b21 * a11 + a21
    out[8] = b20 * a02 + b21 * a12 + a22

    return this
  }

  /**
   * that's transform multiplication we use
   * @param {Matrix2d} pt 
   * @param {Matrix2d} lt 
   */
  setToMult (pt, lt) {
    let out = this.mat3
    const a = pt.mat3, b = lt.mat3

    const a00 = a[0], a01 = a[1], a02 = a[2],
      a10 = a[3], a11 = a[4], a12 = a[5],
      a20 = a[6], a21 = a[7], a22 = a[8],
      b00 = b[0], b01 = b[1], b02 = b[2],
      b10 = b[3], b11 = b[4], b12 = b[5],
      b20 = b[6], b21 = b[7], b22 = b[8]

    out[0] = b00 * a00 + b01 * a10 + b02 * a20
    out[1] = b00 * a01 + b01 * a11 + b02 * a21
    out[2] = b00 * a02 + b01 * a12 + b02 * a22

    out[3] = b10 * a00 + b11 * a10 + b12 * a20
    out[4] = b10 * a01 + b11 * a11 + b12 * a21
    out[5] = b10 * a02 + b11 * a12 + b12 * a22

    out[6] = b20 * a00 + b21 * a10 + b22 * a20
    out[7] = b20 * a01 + b21 * a11 + b22 * a21
    out[8] = b20 * a02 + b21 * a12 + b22 * a22

    return this
  }

  prepend (lt) {
    return lt.mat3 ? this.setToMult(lt, this) :
      this.setToMultLegacy(lt, this)
  }
}

export {
  AFFINE,
  Matrix2d
}