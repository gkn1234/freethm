/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-02-05 16:10:33
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-02-19 12:09:14
 */
const common = {
  // 预定义的动画参数，适用于PIXIJS的对象
  ANIMATIONS: {
    // 淡入
    fadeIn: { from: { alpha: 0 }, to: { alpha: 1 } },
    // 淡出
    fadeOut: { from: { alpha: 1 }, to: { alpha: 0 } }
  }
}

export default common