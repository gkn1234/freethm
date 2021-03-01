import Tap from './Tap.js'

// Slide按键的键位信息
export default class SlideItem extends Tap {
  constructor (note = {}, speedChanges = []) {
    super(note, speedChanges)
  }
}