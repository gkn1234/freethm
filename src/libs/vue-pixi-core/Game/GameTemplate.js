/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-01-29 10:00:21
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-02-26 12:04:37
 */
import { Validator } from '@cmjs/utils-validator'
import Reactivity from '../Reactivity.js'

// 游戏面板的每一个容器
export default class GameTemplate extends Reactivity {
  constructor (name = '') {
    super()
    this.name = ''
    this.el = null
    this.style = {}
  }
  
  // 设定dom对象和样式
  set (el, style) {
    this.setElement(el)
    this.setStyle(style)
  }
  
  // 设置dom
  setElement (el) {
    if (Validator.isObject(el)) {
      this.el = el
    }
  }
  // 设置样式对象
  setStyle (style = {}) {
    if (Validator.isObject(style)) {
      this.style = style
    }
  }
  // 合并样式对象
  mergeStyle (style = {}) {
    if (Validator.isObject(style)) {
      Object.assign(this.style, style)
    }
  }
  
  // 设置宽高
  setSize (w, h, unit = 'px') {    
    this.style.width = `${w}${unit}`
    this.style.height = `${h}${unit}`
  }
  // 去掉单位获取宽高数字
  getSizeNum () {
    let { width, height } = this.style
    if (Validator.isString(width)) {
      width = width.replace(/px|vw|vh|%|rem|em/, '')
    }
    if (Validator.isString(height)) {
      height = height.replace(/px|vw|vh|%|rem|em/, '')
    }
    return { width: Number(width), height: Number(height) }
  }
  // 设置缩放比例
  setScale (ratioX, ratioY = null) {
    if (ratioY === null) {
      ratioY = ratioX
    }
    if (!Validator.isValidNum(ratioX) || !Validator.isValidNum(ratioY)) {
      return
    }
    
    let tempTransform = this.style.transform
    if (tempTransform.indexOf('scale') >= 0) {
      tempTransform = tempTransform.replace(/scale\((.*?)\)/i, `scale(${ratioX}, ${ratioY})`)
      this.style.transform = tempTransform
    }
    else {
      this.style.transform = tempTransform + ` scale(${ratioX}, ${ratioY})`
    }
  }
  // 设置旋转角度
  setRotate (angle) {
    if (!Validator.isValidNum(angle)) {
      return
    }
    
    let tempTransform = this.style.transform
    if (tempTransform.indexOf('rotate') >= 0) {
      tempTransform = tempTransform.replace(/rotate\((.*?)\)/i, `rotate(${angle}deg)`)
      this.style.transform = tempTransform
    }
    else {
      this.style.transform = tempTransform + ` rotate(${angle}deg)`
    }
  }
}