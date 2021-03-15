/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-12 11:10:31
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-15 09:45:27
 */
import { computed } from 'vue'
import { GAME_STATE } from '../../Utils.js'

import ReadyPopup from '../../templates/ReadyPopup/ReadyPopup.vue'

export default {
  name: 'UILayer',
  props: {
    state: {
      type: String,
      default: GAME_STATE.ready
    }
  },
  components: {
    ReadyPopup
  },
  setup (props, { emit }) {
    const isReady = computed(() => props.state === GAME_STATE.ready)

    // 状态转移
    function playHandler () { emit('state-change', GAME_STATE.play) }
    function autoHandler () { emit('state-change', GAME_STATE.auto) }
    function pauseHandler () {  emit('state-change', GAME_STATE.pause) }
    function finishHandler () {  emit('state-change', GAME_STATE.finish) }
    
    return {
      isReady,
      playHandler, autoHandler, pauseHandler, finishHandler
    }
  }
}