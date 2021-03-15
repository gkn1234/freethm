/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-02-05 11:54:05
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-13 14:09:05
 */
import { ref, reactive, watchEffect, onMounted, onBeforeUnmount } from 'vue'
import { Texture } from 'pixi.js'
import { Rectangle, useBorderProps, useBackgroundProps } from '@cmgl/graphics'

export default {
  name: 'ProgressBar',
  components: {
    Rectangle
  },
  props: {
    // 进度条进度
    progress: { type: Number, default: 0 },
    // 进度条内部进度部分的缩放比例
    progressScaleX: { type: Number, default: 1 },
    progressScaleY: { type: Number, default: 1 },
    // 进度条宽度
    w: { type: Number, default: 500 },
    // 进度条高度
    h: { type: Number, default: 100 },
    // 进度条矩形的圆角
    radius: { type: Number, default: 0 },

    // 背景矩形的设定参数。如果没有设置Texture项，则由纯色Rectangle实现进度条
    // 背景矩形边框设定详见@cmgl/graphics
    ...useBorderProps(),
    // 背景颜色设定详见@cmgl/graphics
    ...useBackgroundProps(),
    // 进度条颜色
    progressColor: { type: [String, Number], default: 0 },
    // 进度条透明度
    progressAlpha: { type: Number, default: 1 },

    // 一旦设置了Texture项，则无视上面的背景矩形的设定参数，由Sprite贴图实现进度条
    backgroundTexture: { type: [Texture, String], default: null },
    progressTexture: { type: [Texture, String], default: null },
  },
  setup (props) {
    // 进度控制逻辑
    const { progressSprite, progressRec, progressMask } = maskProgress(props)

    return {
      progressSprite, progressRec, progressMask
    }
  }
}

// 进度条进度显示逻辑，通过处理遮罩层实现
function maskProgress (props) {
  // 进度条精灵对象
  let progressSprite = ref(null)
  // 进度条Rectangle对象
  let progressRec = ref(null)
  // 进度条遮罩对象
  let progressMask = ref(null)

  onMounted(() => {
    // 绑定遮罩层
    let target = props.progressTexture ? progressSprite.value : progressRec.value.$el
    target.mask = progressMask.value.$el
  })
  onBeforeUnmount(() => {
    // 在临终前解绑遮罩层
    let target = props.progressTexture ? progressSprite.value : progressRec.value.$el
    target.mask = null
  })

  return { progressSprite, progressRec, progressMask }
}