/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-01-14 14:05:37
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-15 19:53:52
 */
import { Validator } from '@cmjs/utils'
import { Utils } from '../Utils.js'

// 变速对象验证器
export const speedChangeValidtor = new Validator('speedChangeValidtor', {
  // 变速参数，1为原速，没有意义，所以剔除
  speed: { type: Number, default: null, valid: val => Validator.isValidNum(val) && val !== 1 && val >= 0 },
  // 开始时间
  start: { type: Number, default: null, valid: val => Validator.isValidNum(val) },
  // 结束时间
  end: { type: Number, default: null, valid: val => Validator.isValidNum(val) }
})

// 按键位置验证器
export const posValidator = new Validator('posValidator', {
  // 指定该键是几key下的按键，取值范围2 - 8
  key: { type: Number, default: Utils.DEFAULT_KEY_NUM, valid: val => val >= Utils.MIN_KEY_NUM && val <= Utils.MAX_KEY_NUM },
  // 指定该按键在第几条轨道上，有效值取决于key。这里只是把非数字的非法值初始化为0
  pos: { type: Number, default: 0, valid: val => Validator.isNonnegative(val) },
  // 指定该键在原有标准位置下的偏移量，正数向右，负数向左，有效值取决于key和pos。这里只是把非数字的非法值初始化为0
  offset: { type: Number, default: 0, valid: val => Validator.isValidNum(val) },
})

// 键位设置验证器
export const noteValidator = posValidator.extend('noteValidator', {
  type: { type: String, default: null, valid: val => Utils.isValidNoteType(val) },
  // 按键判定时间
  time: { type: Number, default: null, valid: val => Validator.isPositive(val) },
  // 按键持续时间，非负数，默认0，只有Hold对象的此参数不为0
  duration: { type: Number, default: 0, valid: val => Validator.isNonnegative(val) },
  // 按键滑动方向，0 1 2 3 对应旋转 0 90 180 270度，分别为上 / 右 / 下 / 左滑，-1代表不是滑键
  direction: { type: Number, default: -1, valid: val => Number.isInteger(val) && val >= 0 && val <= 3 },
  // 按键样式
  style: { type: Number, default: 0, valid: val => Validator.isNonnegative(val) },
  // 面条结束轨道位置
  end: { type: Object, default: null },
  // 变速对象集，每一个成员都应该是变速id
  speedChangeKeys: { 
    type: Array, 
    default: () => [], 
    valid (val) { return Validator.isValidArray(val, item => Validator.isString(item)) } 
  }
}, {
  isWarn: false
})