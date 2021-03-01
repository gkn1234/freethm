import SlideItem from './SlideItem.js'

// Slide按键的精灵运动
export default class Slide extends SlideItem {
  constructor (note = {}, speedChanges = []) {
    super(note, speedChanges)
  }
}