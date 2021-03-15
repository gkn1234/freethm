import { TweenMax } from 'gsap'

import common from './common.js'

function isObject (obj) {
  return obj && typeof obj === 'object' && !Array.isArray(obj)
}

// 对TweenMax动画方法进行了简单封装，如果需要强大功能则还是要调用封装前的库
class Tween {
  // 动画关键参数
  // 运动元素
  _el = null
  // 持续时间
  _duration = 0
  // 时间曲线
  _ease = null
  // 配置参数
  _config = {}
  // 动画参数
  _animation = {
    from: null,
    to: null
  }

  // 动画状态
  _isExecuted = false

  // 动画播放对象
  tween = null

  constructor () {}

  // 开始动画，并指定动画元素
  static on (el) {
    return new Tween().on(el)
  }

  // 指定动画元素
  on (el) {
    this._el = el
    return this
  }

  // 获取动画元素
  getEl () { return this._el }
  // 获取对象是否已经执行
  isExecuted () { return this._isExecuted }

  // 指定动画时间，单位毫秒
  duration (time = 0) {
    time = time >= 0 && typeof time === 'number' ? time : 0
    this._duration = time
    return this
  }

  // 指定时间曲线
  ease (val) {
    this._ease = val
    return this
  }

  // 指定动画参数，每次都重新覆盖值
  ani (from = null, to = null) {
    if (typeof from === 'string' && Tween.ANIMATIONS[from]) {
      const aniKey = from
      // 第一个参数是字符串，则调用预定义的动画
      from = Tween.ANIMATIONS[aniKey].from
      to = Tween.ANIMATIONS[aniKey].to
    }
    // 记录动画
    this._animation.from = isObject(from) ? from : null
    this._animation.to = isObject(to) ? to : null
    return this
  }

  // 指定其他配置参数，每次都合并值
  config (options = {}) {
    options = isObject(options) ? options : {}
    Object.assign(this._config, options)
    return this
  }

  // 按照设定执行动画，该方法只能执行一次，后续若要进一步执行，需要通过对象tween属性上的play/reverse等播放方法
  exec () {
    return new Promise((resolve, reject) => {
      if (this._isExecuted) {
        /**
         * @attention 控制exec方法只能执行一次，如果要改变执行状态或者再次执行，需要在动画对象上执行各种播放方法
         */
        console.error('The exec() function has run successfully. If you want to replay the animation. Handle this.tween.restart() instead of this.')
        resolve(this)
      }
      if (!isObject(this._el)) {
        // 未指定或者不合法动画元素，不允许播放，直接resolve本体
        const txt = 'Invalid target element!'
        console.error(txt)
        reject(new Error(txt))
      }
      if (!this._animation.from && !this._animation.to) {
        // 未指定动画参数，相当于直接完成执行
        const txt = 'Invalid animation settings!'
        console.error(txt)
        reject(new Error(txt))
      }

      // 指定动画完成函数，加入Promise要素，并更新配置
      const baseOnComplete = this._config.onComplete
      const onComplete = (...args) => {
        if (typeof baseOnComplete === 'function') {
          baseOnComplete(...args)
        }
        resolve(this)
      }
      this._config.onComplete = onComplete

      // 执行标记
      this._isExecuted = true

      // 获取各种配置参数的集合
      let options = {
        ...this._config,
        duration: this._duration / 1000
      }
      if (this._ease) { options.ease = this._ease }
      // console.log(this)
      // 播放动画，并获取到动画播放对象
      if (this._animation.from && this._animation.to) {
        this.tween = TweenMax.fromTo(this._el, this._animation.from, {
          ...options,
          ...this._animation.to
        })
      }
      else if (this._animation.from && !this._animation.to) {
        this.tween = TweenMax.from(this._el, {
          ...options,
          ...this._animation.from
        })
      }
      else if (!this._animation.from && this._animation.to) {
        this.tween = TweenMax.to(this._el, {
          ...options,
          ...this._animation.to
        })
      }
    })
  }

  // 一个方法描述动画，并执行，这里ease对象指定在options里面
  async animate (el, duration = 0, from = null, to = null, options = {}) {
    return await this.on(el).duration(duration).ani(from, to).config(options).exec()
  }

  static async animate (el, duration = 0, from = null, to = null, options = {}) {
    return await new Tween().animate(el, duration, from, to, options)
  }
}

Object.assign(Tween, common)

export default Tween