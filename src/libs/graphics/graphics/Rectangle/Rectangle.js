/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-02-04 18:42:05
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-14 18:09:46
 */
import { useAnchorProps, useBackgroundProps, useBorderProps, useDraw } from '../../plugins/base.js'

export default {
  name: 'Rectangle',
  props: {
    /**
     * @attention Graphics只是一个画板，并非一个图形对象
     * width和height只能对画板起到整体缩放的效果，并不能实际决定图形的尺寸。因此动态改变图像的尺寸通过重绘实现，性能可能不佳。
     */
    /**
     * @attention Graphic只支持纯色填充，beginTextureFill和lineTextureStyle以及相关属性都不再支持。
     * 原因是PC端和移动端因为WEBGL内核的不同，表现不一致。
     * 以后Texture只能用Sprite进行显示
     */

    /* 基础属性通过Attribute继承了  */
    // 锚点属性
    ...useAnchorProps(),
    // 边框属性
    ...useBorderProps(),
    // 背景属性
    ...useBackgroundProps(),
    // 矩形的宽高，不仅仅是缩放效果，会引起面板重绘的真实宽高
    w: { type: Number, default: 100 },
    h: { type: Number, default: 100 },
    // 矩形的圆角
    radius: { type: Number, default: 0 }
  },
  setup (props, { emit }) {
    // 重写draw重绘函数
    function draw (target) {
      if (!target) { return }
      target.clear()
      target.lineStyle(props.bdWidth, props.bdColor, props.bdAlpha, props.bdAlign)
      target.beginFill(props.bgColor, props.bgAlpha)
      // 根据圆角大小决定是画普通矩形或者圆角矩形
      const { startX, startY } = getStart(props)
      target.drawRoundedRect(startX, startY, props.w, props.h, props.radius)
      target.endFill()
      // 重绘触发事件
      emit('draw', target, props)
    }

    // 激活重绘
    const { graphicsObj } = useDraw(draw)

    return { graphicsObj }
  }
}

// 矩形通过锚点计算绘画中心。矩形的绘画中心默认在左上角
function getStart (props) {
  const startX = props.w * props.anchorX * -1
  const startY = props.h * props.anchorY * -1
  return { startX, startY }
}