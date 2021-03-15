/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-05 17:26:11
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-08 17:37:32
 */
import { TYPES, Buffer, Geometry, AbstractBatchRenderer, BatchShaderGenerator, utils } from 'pixi.js'

const shaderVert = `
precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec4 aColor;
attribute float aTextureId;
uniform mat3 projectionMatrix;
varying vec2 vTextureCoord;
varying vec4 vColor;
varying float vTextureId;

void main (void) {
  gl_Position.xyw = projectionMatrix * aVertexPosition;
  gl_Position.z = 0.0;
  vTextureCoord = aTextureCoord;
  vTextureId = aTextureId;
  vColor = aColor;
}`
const shaderFrag = `
varying vec2 vTextureCoord;
varying vec4 vColor;
varying float vTextureId;
uniform sampler2D uSamplers[%count%];

void main (void) {
  vec4 color;
  %forloop%;
  gl_FragColor = color * vColor;
}`

export class Batch2dGeometry extends Geometry {
  _buffer = null
  _indexBuffer = null

  constructor (_static = false) {
    super()

    this._buffer = new Buffer(null, _static, false)
    this._indexBuffer = new Buffer(null, _static, true)

    this.addAttribute('aVertexPosition', this._buffer, 3, false, TYPES.FLOAT)
      .addAttribute('aTextureCoord', this._buffer, 2, false, TYPES.FLOAT)
      .addAttribute('aColor', this._buffer, 4, true, TYPES.UNSIGNED_BYTE)
      .addAttribute('aTextureId', this._buffer, 1, true, TYPES.FLOAT)
      .addIndex(this._indexBuffer)
  }
}

export class Batch2dPlugin extends AbstractBatchRenderer {
  shaderGenerator = new BatchShaderGenerator(shaderVert, shaderFrag)
  geometryClass = Batch2dGeometry
  vertexSize  = 7

  /**
   * @param {PIXI.Renderer} renderer 
   */
  constructor (renderer) {
    super(renderer)
  }

  /**
   * @param {PIXI.DisplayObject} element 
   * @param {PIXI.ViewableBuffer} attributeBuffer 
   * @param {Uint16Array} indexBuffer 
   * @param {Number} aIndex 
   * @param {Number} iIndex 
   */
  packInterleavedGeometry (element, attributeBuffer, indexBuffer, aIndex, iIndex) {
    let { uint32View, float32View } = attributeBuffer

    const p = aIndex / this.vertexSize
    const uvs = element.uvs
    const indices = element.indices
    const vertexData = element.vertexData
    const vertexData2d = element.vertexData2d
    const textureId = element._texture.baseTexture._batchLocation

    const alpha = Math.min(element.worldAlpha, 1.0)

    const argb = alpha < 1.0 && element._texture.baseTexture.alphaMode ? utils.premultiplyTint(element._tintRGB, alpha)
      : element._tintRGB + (alpha * 255 << 24)

    if (vertexData2d) {
      let j = 0
      for (let i = 0; i < vertexData2d.length; i += 3, j += 2) {
        float32View[aIndex++] = vertexData2d[i]
        float32View[aIndex++] = vertexData2d[i + 1]
        float32View[aIndex++] = vertexData2d[i + 2]
        float32View[aIndex++] = uvs[j]
        float32View[aIndex++] = uvs[j + 1]
        uint32View[aIndex++] = argb
        float32View[aIndex++] = textureId
      }
    } 
    else {
      for (let i = 0; i < vertexData.length; i += 2) {
        float32View[aIndex++] = vertexData[i]
        float32View[aIndex++] = vertexData[i + 1]
        float32View[aIndex++] = 1.0
        float32View[aIndex++] = uvs[i]
        float32View[aIndex++] = uvs[i + 1]
        uint32View[aIndex++] = argb
        float32View[aIndex++] = textureId
      }
    }

    for (let i = 0; i < indices.length; i++) {
      indexBuffer[iIndex++] = p + indices[i]
    }
  }
}