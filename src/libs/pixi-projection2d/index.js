/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-05 10:45:40
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-08 17:32:42
 */
import { Batch2dPlugin } from './basic/Sprite2dRenderer.js'

/**
 * 注册sprite-2d的渲染器，使其能正常工作
 * @param {PIXI.Renderer} renderer 
 */
export function registerProjection (renderer) {
  renderer.registerPlugin('batch2d', Batch2dPlugin)
}

export { TRANSFORM_STEP } from './basic/AbstractProjection.js'
export { Container2d } from './Container2d.js'
export { Matrix2d, AFFINE } from './Matrix2d.js'
export { Projection2d } from './Projection2d.js'
export { Sprite2d } from './Sprite2d.js'
export { Text2d } from './Text2d.js'
