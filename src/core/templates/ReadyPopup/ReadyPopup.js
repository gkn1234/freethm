/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-12 11:19:08
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-15 09:33:06
 */
import { inject, onMounted, reactive, ref } from "vue"
import { Rectangle, Button } from '@cmgl/vue-pixi'
import { Texture } from "pixi.js"

export default {
  name: 'ReadyPopup',
  components: { Rectangle, Button },
  setup (props, { emit }) {
    const game = inject('game')
    const { width, height } = game.$options
    const { resources } = game.$data

    // 屏幕尺寸
    const screen = { width, height }
    // 常用尺寸
    const size = {
      // 封面图区域尺寸
      imgWidth: screen.width * 0.5,
      imgHeight: screen.height * 0.5,
      imgPadding: screen.height * 0.05,
      // 标题区域占据高度
      titleHeight: 150,
      // 按钮位置与尺寸
      buttonWidth: 250,
      buttonHeight: 120,
      buttonPaddingBottom: screen.height * 0.07,
      buttonPaddingSide: screen.width * 0.3
    }

    // 遮罩纹理
    const maskTexture = Texture.WHITE
    // 封面图纹理
    const startImgTexture = resources.bgmImage.texture

    // 按钮触发
    function playHandler () { emit('play') }
    function autoHandler () { emit('auto') }

    return {
      screen, size,
      startImgTexture, maskTexture,
      playHandler, autoHandler
    }
  }
}