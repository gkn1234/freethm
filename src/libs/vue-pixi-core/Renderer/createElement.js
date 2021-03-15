/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-01-29 11:17:24
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-05 18:21:45
 */
import {
  Container,
  Sprite,
  TilingSprite,
  Text,
  Graphics
} from 'pixi.js'

import { Sprite2d, Container2d } from '@cmgl/pixi-projection2d'

export default function getCreateElement () {
  const elementList = {
    Container,
    Sprite,
    TilingSprite,
    Text,
    Graphics,
    // pixi-projection里面的元素
    Container2d,
    Sprite2d
  }

  return (type) => {
    const Creator = elementList[type] ? elementList[type] : Container
    return new Creator()
  }
}