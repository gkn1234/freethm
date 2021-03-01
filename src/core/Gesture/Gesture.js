/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-01-25 09:54:06
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-01-25 10:25:56
 */
import { Game } from '@/libs/index.js'

import Utils from '../Utils.js'

export default class Gesture {
  constructor (id, catcher) {
    this.id = id
    this._catcher = catcher
    this._controller = this._catcher._controller
  }
}
