/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-01-14 14:05:37
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-01-26 12:05:45
 */
import { Validator } from '@/libs/index.js'
import Utils from '../Utils.js'

// 谱面数据验证器
const mapValidator = new Validator('mapValidator', {
  // 节奏
  bpm: Validator.$getter.positiveNum(150),
  // 歌曲标题
  title: { type: String, default: '' },
  // 歌曲难度字符串
  difficulty: { type: String, default: '' },
  // 变速序列
  speedChanges: { type: Array, default () { return [] } },
  // 谱面键位序列
  notes: { type: Array, default () { return [] } }
})

// 变速验证器
const speedChangeValidtor = new Validator('speedChangeValidtor', {
  // 变速参数，1为原速，没有意义，所以剔除
  speed: {
    type: Number,
    valid (value) { return value !== 1 && value > 0 },
    // 默认值设为NaN，因非法而被设为默认值的对象将在针对变速对象的后一轮审查中剔除
    default: NaN,
    warn: false
  },
  // 开始时间
  start: Validator.$getter.validNum(NaN, false),
  // 结束时间
  end: Validator.$getter.validNum(NaN, false)
})

// 按键位置验证器
const posValidator = new Validator('posValidator', {
  // 指定该键是几key下的按键，取值范围2 - 8
  key: {
    type: Number,
    valid (value) { return value >= Utils.MIN_KEY_NUM && value <= Utils.MAX_KEY_NUM },
    default: Utils.DEFAULT_KEY_NUM,
    warn: false
  },
  // 指定该按键在第几条轨道上，有效值取决于key。这里只是把非数字的非法值初始化为0
  pos: Validator.$getter.nonnagetiveNum(0, false),
  // 指定该键在原有标准位置下的偏移量，正数向右，负数向左，有效值取决于key和pos。这里只是把非数字的非法值初始化为0
  offset: Validator.$getter.validNum(0, false),
})

// 键位设置验证器
const noteValidator = posValidator.extend('noteValidator', {
  type: {
    type: String,
    valid (value) { return Utils.isValidNoteType(value) },
    default: null,
    warn: false
  },
  // 按键判定时间
  time: Validator.$getter.validNum(NaN, false),
  // 按键持续时间，非负数，默认0，只有Hold对象的此参数不为0
  duration: Validator.$getter.nonnagetiveNum(0, false),
  // 按键滑动方向，0 1 2 3 对应旋转 0 90 180 270度，分别为上 / 右 / 下 / 左滑，-1代表不是滑键
  direction: {
    type: Number,
    valid (value) { return value >= 0 && value <= 3 },
    // 默认值设为NaN，因非法而被设为默认值的对象将在针对变速对象的后一轮审查中剔除
    default: -1,
    warn: false
  },
  // 按键样式
  style: Validator.$getter.nonnagetiveNum(0, false),
  // 面条结束轨道位置
  end: { type: Object, default: null, warn: false }
})

export {
  mapValidator,
  speedChangeValidtor,
  posValidator,
  noteValidator
}