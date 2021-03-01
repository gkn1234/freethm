/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-02-02 09:06:18
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-01 11:35:50
 */
import { reactive, inject, onMounted } from 'vue'

export default {
  name: 'LoadingScene',
  setup (props, { emit }) {
    // @section 文字样式
    const textStyle = reactive({
      fill: 0xffffff
    })

    // @section 加载资源逻辑
    let game = inject('game')
    let gameConfig = game.getUsed('gameConfig')
    console.log(gameConfig)
    
    function loading () {
      game.$app.loader
        .add(gameConfig.resources)
        .add(gameConfig.bgm)
        .add(gameConfig.bgImage)
        .load((loader, resources) => {
          // 保存资源图集引用
          game.use('sheet', resources[gameConfig.resources].spritesheet)
          // 加载完毕，放出信号准备切换场景，至少停顿500ms
          let timer = setTimeout(() => {
            clearTimeout(timer)
            emit('finish')
          }, 500)
        })
    }
    // 为了配合加载动画，完成挂载后再执行加载
    onMounted(() => {
      loading()
    })

    return {
      textStyle
    }
  }
}