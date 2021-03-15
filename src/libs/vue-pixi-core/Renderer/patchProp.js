/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-01-29 16:30:36
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-01-29 19:24:39
 */
import { Texture } from 'pixi.js'

// 分X与Y方向的的尺寸属性需要特殊处理
const transformKey = ['scale', 'skew', 'anchor', 'pivot']

// 解析分X、Y方向的尺寸
function resolveTransformKey (key) {
  const last = key[key.length - 1]
  const prefix = key.slice(0, key.length - 1)
  if ((last === 'X' || last === 'Y') && transformKey.indexOf(prefix) >= 0) {
    return { prefix, last: last.toLowerCase() }
  }
  return null
}

export default function patchProp (el, key, prevValue, nextValue) {
  if (key === 'texture') {
    // 处理属性是否为texture纹理
    if (nextValue instanceof Texture) {
      el[key] = nextValue
    }
    else {
      // 可以识别字符串，转变成纹理对象
      el[key] = Texture.from(nextValue)
    }
    return
  }

  // 处理几种特殊的变化属性scale\skew\anchor\pivot
  const transformKey = resolveTransformKey(key)
  if (transformKey && el[transformKey.prefix]) {
    el[transformKey.prefix][transformKey.last] = nextValue
    return
  }

  el[key] = nextValue
}