/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-02-04 18:41:49
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-12 18:32:03
 */
import { useAnchorProps, useBackgroundProps, useBorderProps, useDraw } from '../../plugins/base.js'

export default {
  name: 'Ellipse',
  props: {
    // 通常属性同矩形，相关描述见Rectangle.js
    // 锚点属性
    ...useAnchorProps(),
    // 边框属性
    ...useBorderProps(),
    // 背景属性
    ...useBackgroundProps(),
    // 横向半径
    rw: { type: Number, default: 50 },
    // 纵向半径
    rh: { type: Number, default: 50 },
  },
  setup (props, { emit }) {
    // 重写draw重绘函数
    function draw (target) {
      if (!target) { return }
      target.clear()
      target.lineStyle(props.bdWidth, props.bdColor, props.bdAlpha, props.bdAlign)
      target.beginFill(props.bgColor, props.bgAlpha)
      const { startX, startY } = getStart(props)
      target.drawEllipse(startX, startY, props.rw, props.rh)
      target.endFill()
      // 重绘触发事件
      emit('draw', target, props)
    }

    // 激活重绘
    const { graphicsObj } = useDraw(draw)

    return { graphicsObj }
  }
}

// 椭圆通过锚点计算绘画中心。椭圆的绘画中心默认在圆心
function getStart (props) {
  const startX = props.rw * (1 - props.anchorX * 2)
  const startY = props.rh * (1 - props.anchorY * 2)
  return { startX, startY }
}