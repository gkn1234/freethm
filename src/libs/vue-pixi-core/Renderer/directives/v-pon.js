/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-01-29 20:10:13
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-02-09 10:46:18
 */

export default function vPon () {
  return {
    mounted (el, binding) {
      //console.log('pon-mounted', el, binding)
      el.interactive = true
      el.on(binding.arg, binding.value)
    },
    beforeUnmount (el, binding) {
      // console.log('pon-beforeUnmount', el, binding)
      el.off(binding.arg, binding.value)
    }
  }
}