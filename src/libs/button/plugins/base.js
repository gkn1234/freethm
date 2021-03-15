/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-09 10:58:40
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-12 18:35:26
 */
import { reactive, watchEffect } from 'vue'
import { useBorderProps, useBackgroundProps } from '@cmgl/graphics'
import { Texture } from 'pixi.js'

// 获取按钮类型的组件的一些通用props 
export function useButtonProps () {
  return {
    // 按键宽度
    w: { type: Number, default: 100 },
    // 按键高度
    h: { type: Number, default: 50 },

    // 底部矩形配置相关
    // 是否显示底部矩形
    rec: { type: Boolean, default: true },
    // 边框
    ...useBorderProps(),
    // 背景
    ...useBackgroundProps(),
    // 进度条矩形的圆角
    radius: { type: Number, default: 0 },

    // 中部Sprite的纹理
    bgTexture: { type: [String, Texture], default: null },

    // 顶部Text配置相关
    // 文字
    text: { type: String, default: '' },
    // 字号
    textSize: { type: Number, default: 24 },
    // 颜色
    textColor: { type: [Number, String, Array], default: 0 },
    // 其他样式配置
    textOptions: { type: Object, default () { return {} } },
    // 文字默认居中，offset设定偏移量，右正左负
    offsetX: { type: Number, default: 0 },
    offsetY: { type: Number, default: 0 },
  }
}

/**
 * 处理Button类别组件的文字
 * @param {VueProps} props 组件属性
 * @returns {Object} 按钮文字的样式对象
 */
export function useButtonText (props) {
  let textStyle = reactive({})

  // 初始化字体样式，后续动态更新
  watchEffect(() => {
    textStyle.fill = props.textColor
    textStyle.fontSize = props.textSize
    Object.assign(textStyle, props.textOptions)
  })

  return { textStyle }
}

/**
 * 处理Button的手势响应
 * @param {Function} emit 激发事件的方法 
 * @returns {Object<Function>} callbacks 回调函数对象
 * @returns {Function} 赋予按钮v-gesture的回调函数
 */
export function useButtonEvents (emit) {
  // 回调函数队列
  let callbacks = {
    over: [],
    out: [],
    down: [],
    up: []
  }

  function gestureHandler (gesture) {
    const cbList = callbacks[gesture.name] || []
    cbList.forEach((item) => {
      if (typeof item === 'function') {
        item(gesture)
      }
    })
    if (gesture.name === 'over') {
      emit('over', gesture)
    }
    if (gesture.name === 'out') {
      emit('out', gesture)
    }
    if (gesture.name === 'down') {
      emit('down', gesture)
    }
    if (gesture.name === 'up') {
      emit('up', gesture)
    }
  }

  return { callbacks, gestureHandler }
}