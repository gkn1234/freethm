/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-01-29 10:00:21
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-01 11:39:14
 */
import { ref, onMounted, onBeforeUnmount, inject } from 'vue'
import common from './common.js'

export default {
  name: 'VueGame',
  setup () {
    // 获取重要容器的dom和类名
    const wrapper = ref(null)
    const className = common.CLASSNAME
    
    // 获取游戏对象
    let game = inject('game')
    onMounted(() => {
      game.mountVue(wrapper.value)
      game.createApp()
    })
    
    onMounted(() => {
      // 启动屏幕适配
      game.initScreenFix()
    })
    onBeforeUnmount(() => {
      // 解除屏幕适配
      game.clearScreenFix()
    })
    
    return { 
      className, 
      wrapper, 
      template: game.$template
    }
  }
}