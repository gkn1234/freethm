/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-12 09:34:57
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-15 18:53:31
 */
import { inject, reactive, ref, watch } from 'vue'
import { GAME_STATE } from '../../Utils.js'
import GameStat from './GameStat.js'

import GameLayer from '../GameLayer/GameLayer.vue'
import UILayer from '../UILayer/UILayer.vue'

export default {
  name: 'GameController',
  components: {
    GameLayer,
    UILayer
  },
  setup () {
    // 初始化游戏数据
    const game = inject('game')

    // 游戏状态
    const state = ref(GAME_STATE.ready)
    // 计分统计
    const stat = reactive(new GameStat())


    // 观测游戏状态
    function stateChangeHandler (newState) {
      state.value = newState
    }

    return {
      state, stateChangeHandler
    }
  }
}
