/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-08 10:30:43
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-08 18:16:18
 */
import { Gesture } from '@cmgl/pixi-gesture'

export default function vGesture () {
  // 缓存每一个节点的拖拽控制
  let cache = new WeakMap()

  return {
    mounted (el, binding) {
      console.log('gesture-mounted', el, binding)

      let obj = cache.get(el)
      if (!obj) {
        obj = new Gesture(el, {
          onGesture: binding.value
        })
        cache.set(el, obj)
      }
    },
    beforeUnmount (el, binding) {
      console.log('gesture-beforeUnmount', el, binding)

      const obj = cache.get(el)
      if (obj) {
        // 解绑所有事件
        obj.release()
        cache.delete(el)
      }
    }
  }
}