/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-01 09:38:52
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-01 10:52:01
 */
import { Validator } from '@cmjs/utils'
import { getDefaultGameOptions } from './optionsDefault.js'

const defaultOptions = getDefaultGameOptions()

const optionsValidator = new Validator('optionsValidator', {
  // 资源图集
  resources: { type: String, default: defaultOptions.resources },
  // 背景音乐
  bgm: { type: String, default: defaultOptions.bgm },
  // 背景图片
  bgImage: { type: String, default: defaultOptions.bgImage },
  // 背景图片透明度
  bgImageAlpha: {
    type: Number,
    valid (value) {
      return Validator.isValidNum(value) && value >= 0 && value <= 1
    },
    default: defaultOptions.bgImageAlpha
  },

  // 轨道面板资源名称
  containerSrc: { type: String, default: defaultOptions.containerSrc },
  // 轨道的宽度
  containerWidth: positiveValid(defaultOptions.containerWidth),
  // 轨道面板的高度
  containerHeight: positiveValid(defaultOptions.containerHeight),
  // 音符面板的边框宽度，限制落键范围
  containerBorderWidth: positiveValid(defaultOptions.containerBorderWidth),

  // 判定线资源名称
  judgeSrc: { type: String, default: defaultOptions.judgeSrc },
  // 判定线距离轨道底部的距离
  judgeToBottom: positiveValid(defaultOptions.judgeToBottom),
  // 有效判定区域的宽度
  judgeAreaSize: positiveValid(defaultOptions.judgeAreaSize),

  // 各种按键和note的独特设置
  // Tap
  height_Tap: positiveValid(defaultOptions.height_Tap),
  src_Tap: stringArrayValid(defaultOptions.src_Tap, 3),
  // Slide
  height_Slide: positiveValid(defaultOptions.height_Slide),
  src_Slide: stringArrayValid(defaultOptions.src_Slide, 3),
  // Hold
  splitHeight_Hold: positiveValid(defaultOptions.splitHeight_Hold),
  arrowHeight_Hold: positiveValid(defaultOptions.arrowHeight_Hold),
  src_Hold: stringArrayValid(defaultOptions.src_Hold, 3),
  splitSrc_Hold: stringArrayValid(defaultOptions.splitSrc_Hold, 3),
  arrowSrc_Hold: stringArrayValid(defaultOptions.arrowSrc_Hold, 3),
  // Swipe
  height_Swipe: positiveValid(defaultOptions.height_Swipe),
  arrowHeight_Swipe: positiveValid(defaultOptions.arrowHeight_Swipe),
  src_Swipe: stringArrayValid(defaultOptions.src_Swipe, 3),
  arrowSrc_Swipe: stringArrayValid(defaultOptions.arrowSrc_Swipe, 3),

  // 运动参数
  // 键位从顶部到判定线用时(1速)，速度每加1，用时减去 3/28
  noteMoveTime: positiveValid(defaultOptions.noteMoveTime),
  // 落键速度(可以设置1/2/3/4/5/6/7/8速)
  noteSpeed: positiveValid(defaultOptions.noteSpeed),
  
  // 延迟参数
  // 歌曲播放前的空白时间，单位ms，即使不设置，也会强制空出3秒
  timeBeforeStart: positiveValid(defaultOptions.noteSpeed),
  // 按键延迟时间，正数代表按键延后(音乐提前)，负数代表按键提前(音乐延后)。该参数只影响音乐播放时间，不应该影响按键逻辑！！！
  startDelay: { type: Number, valid: Validator.isValidNum, default: defaultOptions.startDelay },
  
  // 判定区间，大P，小P，Good，Bad，Miss，小于第一个数字的是大P，注意这个值其实是+-x，判定区间大小为此值的两倍。不按照此规范赋值，程序将会发生不可预测的错误
  judgeTime: nonnegativeArrayValid(defaultOptions.judgeTime, 5),
  // 判定得分比例，大P，小P，Good，Bad，Miss，大P为100%。不按照此规范赋值，程序将会发生不可预测的错误
  judgeScorePercent: nonnegativeArrayValid(defaultOptions.judgeScorePercent, 5),
  // 判定特效动画名称，大P，小P，Good，Bad，Miss。不按照此规范赋值，程序将会发生不可预测的错误
  judgeAnimationSrc: stringArrayValid(defaultOptions.judgeAnimationSrc, 5),
  // 判定文字动画，大P，小P，Good，Bad，Miss。不按照此规范赋值，程序将会发生不可预测的错误
  judgeTxtSrc: stringArrayValid(defaultOptions.judgeAnimationSrc, 5),
})

// 特殊数组验证
function arrayValid (defaultVal, valid, len) {
  return {
    type: Array,
    valid: val => Validator.isValidArray(val, valid, len),
    default: defaultVal
  }
}
// 验证字符串数组
function stringArrayValid (defaultVal, len) { return arrayValid(defaultVal, Validator.isString, len) }
// 验证非负数数组
function nonnegativeArrayValid (defaultVal, len) { return arrayValid(defaultVal, Validator.isNonnegative, len) }

// 验证正数
function positiveValid (defaultVal) { return { type: Number, valid: Validator.isPositive, default: defaultVal } }

export default optionsValidator