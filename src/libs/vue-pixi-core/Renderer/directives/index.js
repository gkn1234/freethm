/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-01-29 20:15:18
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-08 15:11:46
 */
import vPshow from './v-pshow.js'
import vTicker from './v-ticker.js'
import vPon from './v-pon.js'
import vDrag from './v-drag.js'
import vGesture from './v-gesture.js'

/**
 * 绑定指令
 * @param {Game} game 游戏对象 
 * @param {Object} app Vue实例对象 
 */
export default function bindDirectives (game, app) {
  if (!app || typeof app.directive !== 'function') {
    return
  }
  
  app.directive('pshow', vPshow())
  app.directive('ticker', vTicker(game))
  app.directive('pon', vPon())
  app.directive('drag', vDrag())
  app.directive('gesture', vGesture())
}