/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-01 10:55:26
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-14 18:14:11
 */
import { ref, nextTick } from 'vue'
import { Tween } from '@cmgl/vue-pixi'

import LoadingScene from '@/scenes/LoadingScene/LoadingScene.vue'
import GameScene from '@/scenes/GameScene/GameScene.vue'

export default {
  name: 'App',
  components: {
    LoadingScene,
    GameScene
  },
  setup () {
    // @section 场景管理
    // 游戏场景
    let gameScene = ref(null)
    let isGame = ref(false)
    // 初始化场景
    let loadingScene = ref(null)
    let isLoading = ref(true)
    // 初始化完成，从初始化页面切换到游戏页面
    async function loadingFinishHandler () {
      await Promise.all([
        closeLoading(),
        openGame()
      ])
    }
    // 页面切换动画
    async function sceneChangeAnimate (target, state = 'enter', duration = 1000) {
      const animationName = state === 'enter' ? 'fadeIn' : 'fadeOut'
      await new Tween().on(target).duration(duration).ani(animationName).exec()
    }
    // 初始化场景关闭
    async function closeLoading () {
      await sceneChangeAnimate(loadingScene.value.$el, 'leave')
      isLoading.value = false
    }
    // 游戏场景打开
    async function openGame () {
      isGame.value = true
      await nextTick()
      await sceneChangeAnimate(gameScene.value.$el, 'enter')
    }

    return {
      gameScene, loadingScene,
      isGame, isLoading, 
      loadingFinishHandler
    }
  }
}