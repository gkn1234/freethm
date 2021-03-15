/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-02-02 09:06:18
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-15 10:44:56
 */
import { reactive, inject, onMounted, ref } from 'vue'
import { ProgressBar } from '@cmgl/vue-pixi'

export default {
  name: 'LoadingScene',
  components: { ProgressBar },
  setup (props, { emit }) {
    let game = inject('game')
    // 屏幕尺寸
    const { width, height } = game.$options
    const screen = { width, height }

    // 加载逻辑
    const { loadingTxt, loadingProgress } = useLoader(game, emit)

    return {
      screen,
      loadingTxt, loadingProgress
    }
  }
}

// 加载逻辑
function useLoader (game, emit) {
  const config = game.$data.config
  const loader = game.$app.loader
  const srcData = {
    sheet: { description: '图集资源', src: config.sheetSrc },
    bgm: { description: '音乐文件', src: config.bgm },
    bgmImage: { description: '歌曲封面', src: config.bgmImage },
    bgImage: { description: '背景图片', src: config.bgImage }
  }

  // 显示文字
  let loadingTxt = ref('')
  // 加载进度
  let loadingProgress = ref(0)

  // 准备加载
  for (let key in srcData) {
    loader.add(key, srcData[key].src)
  }

  // 加载前回调
  loader.onLoad.add((loader, resource) => {
    if (srcData[resource.name]) {
      loadingTxt.value = '正在加载：' + srcData[resource.name].description
    }
  })
  // 加载过程回调
  loader.onProgress.add((loader, resource) => {
    if (srcData[resource.name]) {
      loadingTxt.value = '加载完成：' + srcData[resource.name].description
    }
    loadingProgress.value = loader.progress
  })

  // 为了配合加载动画，完成挂载后再正式执行加载
  onMounted(() => {
    // 加载
    loader.load((loader, resources) => {
      // 保存资源图集引用
      game.$data.resources = resources
      game.$data.sheet = resources.sheet.spritesheet

      // 资源加载完毕后，加载谱面

      // 加载完毕，放出信号准备切换场景，至少停顿500ms
      let timer = setTimeout(() => {
        clearTimeout(timer)
        // emit('finish')
      }, 500)
    })    
  })

  return { loadingTxt, loadingProgress }
}