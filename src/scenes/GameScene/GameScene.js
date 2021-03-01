/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-02-04 16:28:50
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-01 11:30:02
 */
import { reactive, ref, onMounted, inject } from 'vue'
import Utils from '@/core/Utils.js'

export default {
  name: 'GameScene',
  setup () {
    // @section 数据初始化
    // 公共数据
    const game = inject('game')
    const gameConfig = game.getUsed('gameConfig')
    const sheet = game.getUsed('sheet')
    // 激活工具类
    new Utils()
    // 获取游戏尺寸与位置信息
    const { canvasWidth, containerWidth, containerHeight, judgeToBottom, trueHeight, effHeight, affinePoint } = Utils.getPosData()

    // @section 重要的容器对象，场景容器与按键容器
    const scene = ref(null)
    const noteContainer = ref(null)

    // @section UI初始化
    // 主要游戏视觉元素：按键轨道、判定线等UI的可视化情况，初始化为不可见
    let isMainUIVisible = ref(false)
    // 背景图片样式
    let bgImageStyle = reactive({
      width: containerWidth,
      height: containerHeight,
      alpha: gameConfig.bgImageAlpha,
      texture: game.$app.loader.resources[gameConfig.bgImage].texture
    })
    // 按键容器轨道的样式
    let noteContainerStyle = reactive({
      x: canvasWidth / 2,
      y: trueHeight
    })
    onMounted(() => {
      // 轨道挂载后，对其进行仿射变换
      noteContainer.value.proj.setAxisY(affinePoint, -1)
    })
    // 轨道皮肤的样式
    let noteContainerSkinStyle = reactive({
      anchorX: 0.5,
      anchorY: 1,
      width: containerWidth * (trueHeight / containerHeight),
      height: effHeight,
      texture: sheet.textures[gameConfig.containerSrc]
    })
    // 判定线的样式
    let judgeLineStyle = reactive({
      width: containerWidth,
      height: judgeToBottom,
      anchorX: 0.5,
      anchorY: 0,
      x: canvasWidth / 2,
      y: trueHeight,
      texture: sheet.textures[gameConfig.judgeSrc]
    })


    // @section 通用方法

    return {
      // 节点实例
      scene, noteContainer,
      // UI样式
      isMainUIVisible, bgImageStyle, noteContainerStyle, noteContainerSkinStyle, judgeLineStyle,
    }
  }
}