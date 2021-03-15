/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-05 17:02:04
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-05 17:05:41
 */
import { Text } from 'pixi.js'
import { Sprite2d } from './Sprite2d.js'
import { Projection2d } from './Projection2d.js'

export class Text2d extends Text {
  vertexData2d = null
  proj = {}

  /**
   * @param {String} text 
   * @param {PIXI.TextStyle/Object} style 
   * @param {HTMLCanvasElement} canvas 
   */
  constructor(text, style, canvas) {
    super(text, style, canvas)
    this.proj = new Projection2d(this.transform)
    this.pluginName = 'batch2d'
  }

  get worldTransform() {
    return this.proj.affine ? this.transform.worldTransform : this.proj.world
  }
}

Text2d.prototype.calculateVertices = Sprite2d.prototype.calculateVertices
Text2d.prototype.calculateTrimmedVertices = Sprite2d.prototype.calculateTrimmedVertices
Text2d.prototype._calculateBounds = Sprite2d.prototype._calculateBounds