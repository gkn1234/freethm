/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-09 15:27:40
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-14 18:08:41
 */
import { shallowRef, watchEffect, onMounted, onBeforeUnmount } from 'vue'

/**
 * @attention Graphic只支持纯色方法，beginTextureFill和lineTextureStyle以及相关属性都不再支持。
 * 原因是PC端和移动端因为WEBGL内核的不同，表现不一致。
 * 以后Texture只能用Sprite进行显示
 */

// 边框线段属性
export function useBorderProps () {
  return {
    // 线的宽度
    bdWidth: { type: Number, default: 0 },
    // 线的颜色
    bdColor: { type: [String, Number], default: 0xffffff },
    // 线的透明度
    bdAlpha: { type: Number, default: 1 },
    // 线段的对齐方式(0 = 内部，0.5 = 居中，1 = 外部)
    bdAlign: { type: Number, default: 1 },
  }
}
// 内部填充属性
export function useBackgroundProps () {
  return {
    // 内部填充颜色
    bgColor: { type: [String, Number], default: 0xffffff },
    // 内部填充透明度
    bgAlpha: { type: Number, default: 1 },
  }
}

// 锚点属性
export function useAnchorProps () {
  return {
    anchorX: { type: Number, default: 0 },
    anchorY: { type: Number, default: 0 }
  }
}

/**
 * 图形组件都是检测到属性变化后，通过重绘实现，这里是在确定了不同的重绘方法后，实现重绘注册逻辑
 * @param {Function} draw 重写的画图方法，
 */
export function useDraw (draw) {  
  /**
   * function draw () {}
   * draw方法的参数说明
   * @param {PIXI.DisplayObject} target 有效的PIXI显示对象
   */
  
  /**
   * 图形对象
   * 这里必须用shallowRef，因为Texture、Graphic都很重，有循环结构，用ref会让watchEffect进入循环地狱
   */
  const graphicsObj = shallowRef(null)

  watchEffect(() => {
    draw(graphicsObj.value)
  })

  onMounted(() => {
    draw(graphicsObj.value)
  })

  onBeforeUnmount(() => {
    // 请注意，由于图形可以与其他实例共享GraphicsGeometry。有必要调用destroy() 来正确地解除对底层GraphicsGeometry的引用并避免内存泄漏。或者，继续使用相同的Graphics实例，并在重绘之间调用 clear()。
    // 防止内存泄漏的操作
    graphicsObj.value.destroy()
  })

  return { graphicsObj }
}