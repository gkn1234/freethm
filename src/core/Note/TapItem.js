import { Game } from '@/libs/index.js'
import Utils from '../Utils.js'

let game, gameConfig, sheet

// 重要数据初始化
function _getData () {
  game = new Game()
  gameConfig = game.getUsed('gameConfig')
  sheet = game.getUsed('sheet')
}

// Tap键型信息，也是所有类型按键的基类。
// 此类虽然参与构成Tap类，但是主要描述谱面的一个键位该如何获取参数信息与选项，不涉及谱面如何在画布上渲染以及运动。
// 为了逻辑划分清楚，与精灵运动逻辑分别划分为两个类。
export default class TapItem {
  // note为该按键的选项，speedChanges为全局变速列表
  constructor (note = {}, speedChanges = []) {
    _getData()
    
    this._init(note, speedChanges)
  }

  /* @section 谱面键位信息获取 */
  _init (note = {}, speedChanges = []) {
    Object.assign(this, note)
    // 对于 key/pos/offset 三个轨道位置参数进行修正，并计算出位置信息width/x
    this._fixPos(this)
    
    // 获取独特的设置，如高度，资源纹理等
    this._initUnique()
    // 解析变速信息
    this._resolveSpeedChange(speedChanges)
  }
  
  // 获取独特的设置，如高度，资源纹理等
  _initUnique () {
    const { src, height } = Utils.getNoteUnique(this.type)
    
    this.textureName = src[this.style]
    this.texture = sheet.textures[this.textureName]
    this.height = height
  }
  
  /* @section 位置计算方法 */
  /*
    key/pos/offset 三个参数能够精确指定按键在轨道中的位置，此函数对于传入对象obj的三参数进行修正
    @key {Number} [4] - 指定该键是几key下的按键，取值范围2 - 8
    @pos {Number} [1] - 指定该按键在第几条轨道上，0号轨道在最左边，取值范围0 - (key - 1)
    @offset {Number} [0] - 指定该键在原有标准位置下的偏移量，正数向右，负数向左。-4会偏移到左边一轨，4会偏移到右边一轨
  */
  _fixPos (obj) {
    // 进一步规范化pos
    obj.pos = obj.pos >= 0 && obj.pos < obj.key ? Math.floor(obj.pos) : 0
      
    // 分析offset
    if (obj.offset < 0 || obj.offset >= Utils.OFFSET_TO_NEXT) {
      // offset超出限制，先算出offset的极限
      const { min, max } = this._getOffsetBorder(obj)
      if (obj.offset < min) {
        obj.offset = min
      }
      if (obj.offset > max) {
        obj.offset = max
      }
      // 大于OFFSET_TO_NEXT的offset要通过偏移pos的方式控制下来
      const deltaPos = Math.floor(obj.offset / Utils.OFFSET_TO_NEXT)
      obj.pos = obj.pos + deltaPos
      obj.offset = obj.offset % Utils.OFFSET_TO_NEXT
    }
    
    // 最后根据三大参数补充位置信息
    this._getGeo(obj)
  }
  
  // 以当下对象的key和pos，计算offset的临界值
  _getOffsetBorder (obj) {
    const rightPos = Utils.MAX_KEY_NUM - obj.pos
    const leftPos = obj.pos
    return {
      min: (-1) * leftPos * Utils.OFFSET_TO_NEXT,
      max: rightPos * Utils.OFFSET_TO_NEXT
    }
  }
  
  /*
    以给定对象的三大参数计算出位置信息
    X坐标参考anchor(0.5, 0)
  */
  _getGeo (obj) {
    // 获取有效宽度
    const { effWidth, containerWidth } = Utils.getPosData()
    
    // 按键宽度
    const width = effWidth / obj.key
    // 原始坐标，以游戏区域最左侧为原点
    const offsetX = (containerWidth - effWidth) / 2
    const rawX = obj.pos * width + obj.offset * (width / Utils.OFFSET_TO_NEXT) + (width * 0.5) + offsetX
    // 转换为坐标系内的有效坐标，以判定线中点为原点
    const x = Utils.raw2EffX(rawX)
    
    obj.width = width
    obj.x = x
  }
  
  /* @section 变速计算方法 */
  // 解析变速，计算初始高度和开始下落的时间
  _resolveSpeedChange (speedChanges = []) {
    const { timeBeforeStart } = gameConfig
    const { tNoteMove, vStandard } = Utils.getMoveData()
    const { effHeight } = Utils.getPosData()
    
    // 初始化变速区间，构建一个从游戏开始到按键落下的时间序列
    const startTime = timeBeforeStart * (-1)
    const endTime = this.time + this.duration
    let speedSections = [this._createSpeedSection(startTime, endTime, 1)]
    
    // 初始化y - 按键初始高度
    this.y = null
    // 初始化start - 按键下落时间
    this.start = null
    // 初始化Hold的长度
    this.distance = null
    
    let len = speedChanges.length
    for (let i = 0; i < len; i++) {
      const speedChange = speedChanges[i]
      // 切割变速区间
      this._cutSpeedSections(speedSections, speedChange)
    }
    
    const startIndex = this._findSpeedSectionIndex(speedSections, this.time)
    const endIndex = speedSections.length - 1
    let s = 0
    // 根据relativeSpeedChange中的变速对象，计算按键从顶部出现的准确时间
    for (let i = startIndex; i >= 0; i--) {
      const section = speedSections[i]
      const v = section.speed * vStandard
      const t = i === startIndex ? this.time - section.start : section.end - section.start
      if (s + v * t >= effHeight) {
        // 距离超限，说明下落点就在这一段，按键可以从顶点下落
        const tLeft = (effHeight - s) / v
        this.start = i === startIndex ? this.time - tLeft : section.end - tLeft
        this.y = Utils.raw2EffY(0)
        break
      }
      s = s + v * t
    }
    if (this.y === null || this.start === null) {
      // 若追溯到源头都无法走完路程，说明开头的起始位置不为0
      this.y = Utils.raw2EffY(effHeight - s)
      this.start = startTime      
    }
    
    // 迭代计算Hold长按的长度
    let d = 0
    for (let i = endIndex; i >= startIndex; i--) {
      const section = speedSections[i]
      const v = section.speed * vStandard
      const t = i === startIndex ? section.end - this.time : section.end - section.start
      d = d + v * t
    }
    this.distance = d
  }
  
  
  // 创建变速区间
  _createSpeedSection (start, end, speed = 1) {
    return { start, end, speed }
  }
  
  // 给定变速区间和时间，定位变速对象
  _findSpeedSectionIndex (speedSections = [], time) {
    const index = speedSections.findIndex((obj) => {
      return obj.start < time && time <= obj.end
    })
    return index
  }
  
  // 切割变速区间
  _cutSpeedSections (speedSections = [], speedChange) {
    const index = this._findSpeedSectionIndex(speedSections, speedChange.start)
    if (index < 0) { return }
    
    const section = speedSections[index]
    if (section.speed !== 1) {
      // 因为变速区间不可重叠，所以不会对speed不为1的区间进行处理
      return
    }
  
    if (speedChange.end >= section.end) {
      // 情况1 左边界不够，右边界超出
      const tail = section.end
      section.end = speedChange.start
      speedSections.splice(index + 1, 0, this._createSpeedSection(speedChange.start, tail, speedChange.speed))
      return
    }
    else {
      // 情况2 左边界不够，右边界也不够
      const tail = section.end
      section.end = speedChange.start
      speedSections.splice(index + 1, 0, this._createSpeedSection(speedChange.start, speedChange.end, speedChange.speed))
      speedSections.splice(index + 2, 0, this._createSpeedSection(speedChange.end, tail, 1))
      return
    }
  }
  
  /* @section 转谱方法 */
}