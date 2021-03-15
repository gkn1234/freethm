/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-12 10:11:47
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-12 13:36:02
 */
import { computed, inject, reactive, ref, onMounted } from 'vue'
import { GAME_STATE } from '../../Utils.js'

export default {
  name: 'GameLayer',
  props: {
    state: {
      type: String,
      default: GAME_STATE.ready
    }
  },
  setup (props) {
    const game = inject('game')

    // 游戏主舞台显示
    const { 
      bgImageStyle,
      noteContainer, noteContainerStyle,
      noteContainerSkinStyle,
      judgeLineStyle,
      isStageShow
    } = useStage(props, game.$data)



    return {
      bgImageStyle, noteContainer, noteContainerStyle, noteContainerSkinStyle, judgeLineStyle, isStageShow
    }
  }
}

// 游戏舞台
function useStage (props, { utils, config, resources, sheet }) {
  const { canvasWidth, containerWidth, containerHeight, judgeToBottom, trueHeight, effHeight, affinePoint } = utils.getPosData()

  // 背景图片样式
  let bgImageStyle = reactive({
    width: containerWidth,
    height: containerHeight,
    alpha: config.bgImageAlpha,
    texture: resources.bgImage.texture
  })

  // 轨道容器
  const noteContainer = ref(null)
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
    texture: sheet.textures[config.containerSrc]
  })

  // 判定线的样式
  let judgeLineStyle = reactive({
    width: containerWidth,
    height: judgeToBottom,
    anchorX: 0.5,
    anchorY: 0,
    x: canvasWidth / 2,
    y: trueHeight,
    texture: sheet.textures[config.judgeSrc]
  })

  // 判定线和轨道在游戏正式开始后显示
  const isStageShow = computed(() => props.state !== GAME_STATE.ready)

  return { 
    bgImageStyle,
    noteContainer, noteContainerStyle,
    noteContainerSkinStyle,
    judgeLineStyle,
    isStageShow
  }
}