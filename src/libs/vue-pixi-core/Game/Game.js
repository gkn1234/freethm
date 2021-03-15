/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-01-29 09:44:02
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-11 18:53:11
 */
import { createApp } from 'vue'
import { Application, Renderer } from 'pixi.js'

import { Validator } from '@cmjs/utils-validator'
import { Event } from '@cmjs/utils-event'
import { registerProjection } from '@cmgl/pixi-projection2d'

import getPIXIRenderer from '../Renderer/index.js'
import GameTemplate from './GameTemplate.js'
import common from './common.js'
import { getDefaultOptions, gameOptionsValidator } from './gameOptions.js'
import VueGame from './VueGame.vue'

class Game {
  // @section 插件注册情况相关
  static PLUGINS = {
    // pixi-projections
    projections: false
  }

  // 游戏参数配置
  $options = getDefaultOptions()
  // 用于挂载游戏全局数据，如 game.$data.xxx = xxx
  $data = {}
  // 游戏Dom容器对象
  $template = {}
  // 对象的事件总线
  $event = new Event()
  // PIXI Application对象
  $app = null
  // PIXI 渲染器对象
  $renderer = null


  constructor (options = {}) {    
    // 初始化游戏参数配置
    if (Validator.isObject(options)) {
      Object.assign(this.$options, options)
    }
    // 校验参数配置
    gameOptionsValidator.mount(this.$options)
    
    // 初始化PIXI插件
    this._initPixiPlugins()

    // 初始化元素模板、dom、样式
    this._initTemplate()
  }
  
  // 初始化PIXI插件
  _initPixiPlugins () {
    if (!Game.PLUGINS.projections) {
      // 注册pixi-projection
      registerProjection(Renderer)
      Game.PLUGINS.projections = true
    }
  }

  // 初始化元素模板、dom、样式
  _initTemplate () {
    // 初始化样式
    const styles = Game._getDefaultStyle()
    // 外层容器
    this.$template.wrapper = new GameTemplate('wrapper')
    this.$template.wrapper.setStyle(styles.wrapper)
    // canvas画布
    this.$template.canvas = new GameTemplate('canvas')
    this.$template.canvas.setStyle(styles.canvas)
  }
  
  // 挂载到指定dom下，不支持miniGame为true的小游戏环境
  mount (selector = '') {
    let el = document.querySelector(selector)
    if (!el) { el = document.body }
    let app = createApp(VueGame)
    // 将game对象作为全局变量注入给Vue模板，以便在模板中访问对象
    app.provide('game', this)
    // 绑定到指定的dom
    app.mount(el)
    return this
  }

  // 在Vue组件的初始化的过程中中获取各个容器
  mountVue (wrapper) {
    // 外层容器
    this.$template.wrapper.setElement(wrapper)
    // canvas
    const canvas = this.$template.wrapper.el.querySelector('#' + Game.CLASSNAME.canvas)
    this.$template.canvas.setElement(canvas)
    
    // 所以这里要立即给canvas补充宽高
    this.$template.canvas.setSize(this.$options.width, this.$options.height)
    return this
  }

  // 注入PIXI渲染器，startTemplate是起始模板，pixiRootContainer是渲染目标，warn指明是否在开发环境下警告
  pixiRender (startTemplate, pixiRootContainer = null, warn = false) {
    if (!this.$renderer) {
      this.$renderer = getPIXIRenderer(this)
    }
    if (!pixiRootContainer) {
      pixiRootContainer = this.$app.stage
    }
    
    let app = this.$renderer.createApp(startTemplate)

    // 将game对象作为全局变量注入给渲染器
    app.provide('game', this)
    
    if (!warn) {
      // 开发环境下取消警告信息
      app.config.warnHandler = function(msg, vm, trace) {
        // console.log(msg, vm, trace)
      }      
    }
    
    // 渲染到对应的节点
    app.mount(pixiRootContainer)
    
    return this
  }

  // 创建PIXI游戏应用
  createApp () {
    if (!this.$template.canvas.el) {
      console.error('App can only be created after canvas has completed!')
      return
    }
    
    // 创建PIXI.Application
    this.$app = new Application({
      width: this.$options.width,
      height: this.$options.height,
      view: this.$template.canvas.el,
      ...this.$options.pixiOptions
    })

    // APP对象创建后，Game对象准备完成，触发onLoad生命周期
    this.$event.emit(Game.LIFECYCLE_HANDLER_NAME.load)

    return this
  }

  /* @section 游戏生命周期事件指定 */
  // 指定游戏完全加载完成时触发的事件
  onLoad (handler = () => {}) {
    this.$event.on(Game.LIFECYCLE_HANDLER_NAME.load, handler)
    return this
  }
  
  /* @section 屏幕适配 */
  // 绑定横屏事件
  onLandscape (handler = () => {}) {
    this.$event.on(Game.SCREEN_HANDLER_NAME.landscape, handler)
    if (Validator.isFunction(this.$resizeHandler)) {
      // 绑定完后立即进行适配
      this.$resizeHandler()
    }
    return this
  }
  // 绑定竖屏事件
  onPortrait (handler = () => {}) {
    this.$event.on(Game.SCREEN_HANDLER_NAME.portrait, handler)
    if (Validator.isFunction(this.$resizeHandler)) {
      // 绑定完后立即进行适配
      this.$resizeHandler()
    }
    return this
  }
  
  // 触发屏幕适配
  initScreenFix () {
    this.$resizeHandler = this._resizeHandler.bind(this)
    this.$resizeHandler()
    window.addEventListener('resize', this.$resizeHandler)
  }
  // 解除屏幕适配
  clearScreenFix () {
    this.$event.off(Game.SCREEN_HANDLER_NAME.landscape)
    this.$event.off(Game.SCREEN_HANDLER_NAME.portrait)
    window.removeEventListener('resize', this.$resizeHandler)
  }
  
  // 屏幕尺寸变化触发
  _resizeHandler () {
    const { offsetWidth, offsetHeight } = this.$template.wrapper.el
    // console.log(offsetWidth, offsetHeight)
    if (offsetWidth >= offsetHeight) {
      // 宽大于高，视为横屏
      this.$event.emit(Game.SCREEN_HANDLER_NAME.landscape)
    }
    else {
      // 宽小于高，视为纵屏
      this.$event.emit(Game.SCREEN_HANDLER_NAME.portrait)
    }
  }
  
  // 在不影响绑定事件的情况下，将canvas画布旋转90度
  rotateStage () {
    const { width, height } = this.$options
    this.$template.canvas.setSize(height, width)
    // 主舞台旋转重定位
    const { stage, renderer } = this.$app
    stage.rotation = Math.PI / 2
    stage.x = height
    // 重新设定渲染器尺寸
    renderer.resize(height, width)
  }
  // canvas画布复原
  resetStage () {
    const { width, height } = this.$options
    this.$template.canvas.setSize(width, height)
    // 主舞台旋转重定位
    const { stage, renderer } = this.$app
    stage.rotation = 0
    stage.x = 0 
    // 重新设定渲染器尺寸
    renderer.resize(width, height)
  }
  // 以容器wrapper的高度为基准，保持canvas画布比例不变的情况下顶满高度
  fixHeight () {
    // 获取参照宽高度
    const { innerWidth, innerHeight } = window
    let { width, height } = this.$template.canvas.getSizeNum()
    const wrapper = this.$template.wrapper.el
    // 优先根据容器宽度计算出目标宽度与比例
    let targetHeight = wrapper.offsetHeight > innerHeight ? innerHeight : wrapper.offsetHeight
    let ratio = targetHeight / height
    let targetWidth = ratio * width
    // console.log(targetWidth, targetHeight)
    if (targetWidth > innerWidth) {
      // 宽度自适应后发现超出限制，重新计算比例
      targetWidth = innerWidth
      ratio = targetWidth / width
    }
    // 调整缩放
    this.$template.canvas.setScale(ratio)
  }
  // 以容器wrapper的宽度为基准，保持canvas画布比例不变的情况下顶满宽度
  fixWidth () {
    // 获取参照宽高度
    const { innerWidth, innerHeight } = window
    let { width, height } = this.$template.canvas.getSizeNum()
    const wrapper = this.$template.wrapper.el
    // 优先根据容器高度计算出目标高度与比例
    let targetWidth = wrapper.offsetWidth > innerWidth ? innerWidth : wrapper.offsetWidth
    let ratio = targetWidth / width
    let targetHeight = ratio * height
    // console.log(targetWidth, targetHeight)
    if (targetHeight > innerHeight) {
      // 高度自适应后发现超出限制，重新计算比例
      targetHeight = innerHeight
      ratio = targetHeight / height
    }
    // 调整缩放
    this.$template.canvas.setScale(ratio)
  }
  // 无视canvas画布的比例变化，顶满容器
  fixFull () {
    // 获取参照宽高度
    const { innerWidth, innerHeight } = window
    let { width, height } = this.$template.canvas.getSizeNum()
    const wrapper = this.$template.wrapper.el
    const targetWidth =  wrapper.offsetWidth > innerWidth ? innerWidth : wrapper.offsetWidth
    const targetHeight = wrapper.offsetHeight > innerHeight ? innerHeight : wrapper.offsetHeight
    const ratioX = targetWidth / width
    const ratioY = targetHeight / height
    // 调整缩放
    this.$template.canvas.setScale(ratioX, ratioY)
  }
}

// 绑定静态方法
Object.assign(Game, common)
Game.optionsValidator = gameOptionsValidator

export default Game