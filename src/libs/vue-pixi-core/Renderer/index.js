/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-01-29 10:29:28
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-14 18:02:55
 */
import { createRenderer } from 'vue'
import { Text, Container } from 'pixi.js'

import getCreateElement from './createElement.js'
import patchProp from './patchProp.js'

import bindDirectives from './directives/index.js'

export default function getPIXIRenderer(game) {
  let renderer = createRenderer({
    // 创建一个元素
    createElement (type) {
      //console.log('createElement', type)
      const createElement = getCreateElement()
      return createElement(type)
    },
    // 插入到对应的容器
    insert (el, parent) {
      //console.log('insert', el, parent)
      parent.addChild(el)
    },
    // 从容器中删除元素
    remove (el) {
      //console.log('remove', el)
      const parent = el.parent
      if (parent) {
        parent.removeChild(el)
      }
    },
    // 查找父元素的方法
    parentNode (el) {
      //console.log('parentNode', el)
      return el.parent
    },
    // 查找兄弟元素的方法
    nextSibling (el) {
      //console.log('nextSibling', el)
      if (!el.parent) { return null }
      const index = el.parent.getChildIndex(el)
      const len = el.parent.children.length
      const sibling = index >= len - 1 || index < 0 ? null : el.parent.getChildAt(index + 1)
      return sibling
    },
    // 传递props的行为
    patchProp (el, key, prevValue, nextValue) {
      // console.log('patchProp', el, key, prevValue, nextValue)
      patchProp(el, key, prevValue, nextValue)
    },
    // 创建文字节点的方法
    createText(text) {
      //console.log('createText', text)
      return new Text(text);
    },
    // 创建注释的方法
    createComment (text) {
      //console.log('createComment', text)
      let el = new Container()
      el.name = text
      return el
    }
  })

  // 临时保存创建启动方法
  const _createApp = renderer.createApp.bind(renderer)

  /**
   * 重写启动方法，在启动后做更多的处理
   * @param {Object} component 组件模板
   */
  renderer.createApp = (component) => {
    const app = _createApp(component)

    // 更多处理，处理指令
    bindDirectives(game, app)

    return app
  }

  return renderer
}