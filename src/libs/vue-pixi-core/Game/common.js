/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-01-29 10:00:21
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-01-29 10:01:33
 */
// 定义Game类的静态方法和变量
const common = {
  // 各种容器的类名
  CLASSNAME: {
    wrapper: 'game-wrapper',
    canvas: 'game-canvas'
  },
  // 枚举，横纵屏触发函数名
  SCREEN_HANDLER_NAME: {
    landscape: 'onScreenLandscape',
    portrait: 'onScreenPortrait'
  },
  // 枚举，游戏的生命周期名称
  LIFECYCLE_HANDLER_NAME: {
    load: 'onLoad'
  },
  
  // 获取基本样式
  _getDefaultStyle () {
    return {
      // 外层容器样式，一般情况下不会变
      wrapper: {
        position: 'relative',
        textAlign: 'center',
        height: '100%',
        width: '100%'
      },
      // canvas画布样式
      canvas: {
        position: 'absolute',
        margin: '0 auto',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
    }
  },
  
  // 判断是否为移动设备
  isMobile () {
    return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  },
  
  // 节流函数，使得handler函数每次执行都必须有一个间隔wait
  throttle (handler = () => {}, wait) {
    let lastTime = 0
    
    return function () {
      let nowTime = new Date().getTime()
      
      if (nowTime - lastTime > wait) {
        handler.apply(this, arguments)
        lastTime = nowTime
      }
    }
  },
  
  // 防抖函数，使得handler函数将被延迟执行，无论触发的速度有多快，适用于输入
  debounce (handler = () => {}, delay) {
    let timer
   
    return function () {
      const arg = arguments
      clearTimeout(timer)
      timer = setTimeout(() => {
        handler.apply(this, arg)
      }, delay)
    }
  }
}

export default common