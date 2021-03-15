/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-01-29 10:00:21
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-01 10:59:17
 */
import { Validator } from '@cmjs/utils-validator'

// 默认游戏配置
const getDefaultOptions = () => {
  return {
    // 游戏渲染区域 canvas的设计宽高
    width: 1280,
    height: 720,
    // 是否引入pixi-projection插件
    pixiProjection: false,
    // pixiJS除了宽高以外的额外配置
    pixiOptions: {}
  }
}

const defaultOptions = getDefaultOptions()
// 游戏配置参数校验器
const gameOptionsValidator = new Validator('gameOptionsValidator', {
  width: {
    type: Number,
    valid (value) { return Validator.isValidNum(value) && value > 0 },
    default: defaultOptions.width,
  },
  height: {
    type: Number,
    valid (value) { return Validator.isValidNum(value) && value > 0 },
    default: defaultOptions.height,
  },
  pixiProjection: { type: Boolean, default: defaultOptions.pixiProjection },
  pixiOptions: { type: Object, default () { return {} } }
}) 

export {
  getDefaultOptions,
  gameOptionsValidator
}