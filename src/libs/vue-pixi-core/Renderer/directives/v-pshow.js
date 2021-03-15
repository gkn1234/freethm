/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-02-02 09:53:00
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-02-04 10:04:41
 */
export default function vPshow () {
  return (el, binding) => {
    el.visible = binding.value ? true : false
  }
}