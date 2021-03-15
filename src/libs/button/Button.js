/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-02-07 17:23:35
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-12 14:45:11
 */
import { Texture } from 'pixi.js'

import { Rectangle } from '@cmgl/graphics'

import { useButtonProps, useButtonText, useButtonEvents } from './plugins/base.js'
import { hoverScaleEffect, clickScaleEffect } from './plugins/animations.js'

export default {
  name: 'Button',
  components: {
    Rectangle
  },
  props: {
    ...useButtonProps(),
    
    // @section 特效区
    // 鼠标悬停特效，缩放倍率
    hoverScale: { type: Number, default: null },
    // 鼠标悬停特效，单程时间
    hoverScaleDuration: { type: Number, default: 100 },

    // 鼠标按下特效，缩放倍率
    clickScale: { type: Number, default: null },
    // 鼠标按下特效，单程时间
    clickScaleDuration: { type: Number, default: 50 }
  },
  setup (props, { emit }) {
    const { textStyle } = useButtonText(props)

    // 手势触发
    const { gestureHandler, callbacks } = useButtonEvents(emit)

    // 获取动画组件
    hoverScaleEffect(props, callbacks)
    clickScaleEffect(props, callbacks)

    return {
      textStyle,
      gestureHandler
    }
  }
}
