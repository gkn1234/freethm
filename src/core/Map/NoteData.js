/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-15 16:08:38
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-15 20:06:58
 */
import { NOTE_TYPES, Utils } from '../Utils.js'

export default class NoteData {
  // 游戏对象
  _game = null
  // 通用方法对象
  _utils = null
  // 整个谱面的变速哈希表
  _speedChanges = []

  // Tap按键的基本属性
  // 按键类别
  type = NOTE_TYPES.Tap
  // 指定该键是几key下的按键，取值范围2 - 8
  key = Utils.DEFAULT_KEY_NUM
  // 指定该按键在第几条轨道上，0号轨道在最左边，取值范围0 - (key - 1)
  pos = 0
  // 指定该键在原有标准位置下的偏移量，正数向右，负数向左。-4会偏移到左边一轨，4会偏移到右边一轨
  offset = 0
  // 横坐标
  x = 0
  // 纵坐标
  y = 0
  // 宽高
  width = 0
  height = 0
  // 纹理名称和纹理
  textureName = ''
  texture = null
  // 按键判定时间
  time = 0
  // 长按持续时间
  duration = 0
  // 按键样式
  style = 0
  // 变速对象表，初始化前
  speedChangeKeys = []
  // 按键开始下落的时间
  start = 0
  // 按键彻底完成下落的时间
  end = 0
  // 速度区间，与start配对
  speedSections = []
  // 当前所处的速度区间索引
  speedIndex = 0

  /**
   * 构造函数
   * @param {Object(noteValidator)} options 按键配置项
   * @param {Object<SpeedChange>} speedChanges 变速哈希表
   * @param {Game} game 游戏对象实例
   */
  constructor (options = {}, speedChanges = {}, game) {
    this._game = game
    this._utils = game.$data.utils

    this._speedChanges = speedChanges
    this._init(options)
  }

  /* @section 谱面键位信息获取 */
  _init (options = {}) {
    Object.assign(this, options)
    // 对于 key/pos/offset 三个轨道位置参数进行修正，并计算出位置信息width/x
    this._fixPos(this)
    
    // 获取独特的设置，如高度，资源纹理等
    this._initUnique()
    // 通过变速信息，生成速度区间
    this._initSpeedSections()
  }
  
  // 获取独特的设置，如高度，资源纹理等
  _initUnique () {
    const { src, height } = this._utils.getNoteUnique(this.type)
    
    this.textureName = src[this.style]
    this.texture = sheet.textures[this.textureName]
    this.height = height
  }
  
  /**
   * key/pos/offset 三个参数能够精确指定按键在轨道中的位置，此函数对于传入对象obj的三参数进行修正
   * @param {Object(posValidator)} obj 传入带有位置参数的对象，进行修正、计算。
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
    const { effWidth, containerWidth } = this._utils.getPosData()
    
    // 按键宽度
    const width = effWidth / obj.key
    // 原始坐标，以游戏区域最左侧为原点
    const offsetX = (containerWidth - effWidth) / 2
    const rawX = obj.pos * width + obj.offset * (width / Utils.OFFSET_TO_NEXT) + (width * 0.5) + offsetX
    // 转换为坐标系内的有效坐标，以判定线中点为原点
    const x = this._utils.raw2EffX(rawX)
    
    obj.width = width
    obj.x = x
  }

  // @section 变速相关方法
  /**
   * 通过变速信息，生成速度区间
   */
  _initSpeedSections () {
    // 初始化变速信息
    const speedChanges = this._initSpeedChanges()
    const { tNoteMove, vStandard } = this._utils.getMoveData()

    // 最初时间，游戏前的空白时间也可以落键
    const startTime = Utils.TIME_BEFORE_START * (-1)
    // 最后时间，判定时间加上长按持续时间
    const endTime = this.time + this.duration
    this.end = endTime

    // 初始化按键下落时间
    this.start = this.time - tNoteMove < startTime ? startTime : this.time - tNoteMove
    // 按键初始高度
    this.y = this.time - tNoteMove < startTime ? (startTime - this.time + tNoteMove) * vStandard : 0
    // 初始速度区间
    this.speedSections = [this._createSpeedSection(this.start, this.end, 1)]

    for (let i = speedChanges.length - 1; i >= 0; i--) {
      const speedChange = speedChanges[i]
      // 通过变速对象，处理按键信息，修正按键下落时间start、初始高度y、速度区间speedSections
      this._resolveSpeedChange(speedChange)
    }
  }

  /**
   * 初始化变速信息，参考变速哈希表，将this.speedChanges中应用于本对象的所有变速，从变速id字符串转换为变速对象
   */
  _initSpeedChanges () {
    let speedChanges = []
    for (let i = 0; i < this.speedChangeKeys.length; i++) {
      const speedChangeKey = this.speedChangeKeys[i]
      const speedChangeObj = this._speedChanges[speedChangeKey]
      if (speedChangeObj) {
        // 哈希表中找到了变速对象，从id解析为对象，拷贝后加入变速列表
        speedChanges.push({ ...speedChangeObj })
      }
    }

    // 按照时间升序排序
    speedChanges.sort((a, b) => {
      return a.start - b.start
    })

    // 再一轮审查，后一个变速的end必须小于前一个变速的start，否则将强制调整
    for (let i = 0; i < speedChanges.length; i++) {
      let speedObj = speedChanges[i]
      if (i > 0 && speedObj.start < speedChanges[i - 1].end) {
        // 时间靠前的变速将被时间靠后的变速覆盖
        speedChanges[i - 1].end = speedObj.start
      }
    }
    return speedChanges
  }

  /**
   * 通过变速对象，处理按键信息，修正按键下落时间start、初始高度y、速度区间speedSections
   * @param {Object(speedChangeValidtor)} speedChange 变速对象
   * @return {Boolean} 是否成功处理
   */
  _resolveSpeedChange (speedChange) {
    // 变速时间在区间之外，无法影响到按键
    if (speedChange.start >= this.end) { return }
    if (speedChange.end < this.start) { return }

    // 根据变速对象处理变速区间
    this._resolveSpeedSections(speedChange)
  }

  // 创建速度区间
  _createSpeedSection (start, end, speed = 1) { return { start, end, speed } }

  // 给定时间，定位速度区间
  _findSpeedSectionIndex (time) {
    return this.speedSections.findIndex(obj => obj.start <= time && obj.end > time)
  }

  // 处理变速区间，后到的变速对象不能强行改变先来的变速对象形成的区间
  _resolveSpeedSections (speedChange) {
    const startIndex = this._findSpeedSectionIndex(speedChange.start)
    const endIndex = this._findSpeedSectionIndex(speedChange.start)

    // 因为之前已经排除了变速与区间没有交集的情况，所以此时，区间范围是变速范围的子集
    if (startIndex === -1 && endIndex === -1) {

    }
  }
}