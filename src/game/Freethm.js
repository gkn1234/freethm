/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-01 09:36:24
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-01 11:36:17
 */
import { Validator } from '@cmjs/utils'
import { Game } from '@cmgl/vue-pixi'

import { getDefaultSysOptions, getDefaultGameOptions } from './optionsDefault.js'
import optionsValidator from './optionsValidator.js'
import App from './App.vue'

export default function Freethm (selector = null, gameOptions = {}, mapData = {}, sysOptions = {}) {
  // 初始化游戏选项
  gameOptions = Validator.isObject(gameOptions) ? gameOptions : {}
  gameOptions = Object.assign(getDefaultGameOptions(), gameOptions)
  optionsValidator.mount(gameOptions)
  // 初始化系统选项
  sysOptions = Validator.isObject(sysOptions) ? sysOptions : {}
  sysOptions = Object.assign(getDefaultSysOptions(), sysOptions)
  // 初始化谱面对象
  mapData = Validator.isObject(mapData) ? mapData : {}

  // 初始化游戏对象
  const game = new Game(sysOptions)

  // 将重要参数全部挂载在游戏的全局对象上
  game.use('gameConfig', gameOptions)
  game.use('mapData', mapData)

  // 屏幕适配
  game.onLandscape(() => {
    if (Game.isMobile()) {
      // 移动端横屏适配
      game.resetStage()
      game.fixFull()
    }
    else {
      // PC端横屏适配
      game.fixWidth()    
    }
  })
  game.onPortrait(() => {
    if (Game.isMobile()) {
      // 移动端竖屏适配
      game.rotateStage()
      game.fixFull()
    }
    else {
      // PC端竖屏适配
      game.fixWidth()
    }
  })

  game.mount(selector).pixiRender(App)

  return game
}