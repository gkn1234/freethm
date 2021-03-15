/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-09 11:24:37
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-09 14:55:40
 */
import { computed } from 'vue'
import { Tween } from '@cmgl/tween'

/**
 * Button组件的鼠标悬停缩放特效动画
 * @param {VueProps} props 组件属性
 * @param {Object<Function>} callbacks 回调函数对象，将动画控制的方法绑定到对应的生命周期
 * @return {Object<Function>} hoverScaleHandler的over/out方法，分别用在对应的手势下激活动画特效
 */
export function hoverScaleEffect (props, callbacks) {
  let tween = new Tween()
  // 按键放大动画是否有效
  let enabled = computed(() => { 
    return props.hoverScale !== null && props.hoverScale > 0 && props.hoverScale !== Infinity && props.hoverScale !== NaN
  })

  callbacks.over.push(({ target }) => {
    if (!enabled.value) { return }
    if (tween.getEl() !== target.scale) {
      tween.on(target.scale)
      .duration(props.hoverScaleDuration)
      .ani(null, { x: props.hoverScale, y: props.hoverScale })
      .exec()
    }
    else {
      tween.tween.reversed(false)
    }
  })

  callbacks.out.push(() => {
    if (tween.tween) {
      tween.tween.reversed(true)
    }
  })
}

/**
 * Button组件的鼠标按下缩放特效动画
 * @param @returns 同useHoverScaleAnimation
 */
export function clickScaleEffect (props, callbacks) {
  let tween = new Tween()
  // 动画是否有效
  let enabled = computed(() => { 
    return props.clickScale !== null && props.clickScale > 0 && props.clickScale !== Infinity && props.clickScale !== NaN
  })

  callbacks.down.push(({ target }) => {
    if (!enabled.value) { return }
    if (tween.getEl() !== target.scale) {
      tween.on(target.scale)
      .duration(props.clickScaleDuration)
      .ani(null, { x: props.clickScale, y: props.clickScale })
      .exec()
    }
    else {
      tween.tween.reversed(false)
    }
  })

  function back () {
    if (tween.tween) {
      tween.tween.reversed(true)
    }    
  }
  callbacks.out.push(back)
  callbacks.up.push(back)
}