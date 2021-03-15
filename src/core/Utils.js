import { Point } from 'pixi.js'

import { Validator } from '@cmjs/utils'

// 游戏状态
export const GAME_STATE = {
  ready: 'ready',
  play: 'play',
  auto: 'auto',
  pause: 'pause',
  finish: 'finish'
}

// 按键类型
export const NOTE_TYPES = {
  Tap: 'Tap',
  Slide: 'Slide',
  Swipe: 'Swipe',
  Hold: 'Hold'
}

// 和FR Game实例绑定，用于从config配置中进一步计算得出音游的常用的数据
export class Utils {
  // 按键offset偏移到下一轨时的参数
  static OFFSET_TO_NEXT = 4
  // 最大与小轨道数
  static MIN_KEY_NUM = 2
  static MAX_KEY_NUM = 8
  static DEFAULT_KEY_NUM = 4
  // 对下落容器进行仿射变换的倍率，这样顶部宽度正好是底部宽度的1 / 5
  // 仿射变换的原理没有搞清楚，现在是摸索API试出来的效果，以后一定要好好学计算机图形学
  static AFFINE_FACTOR = 5
  
  // 速度在1速的基础上每增加1，用时减少的比例，最高8速用时比例为 7 / 28，正好是 1 / 4，相当于节奏大师4速
  static SPEED_TIME_FACTOR = 3 / 28

  // 歌曲播放前的空白时间，单位ms，即使不设置，也会强制空出3秒
  static TIME_BEFORE_START = 3000

  // 实例属性
  // 游戏对象实例
  _game = null
  // 游戏配置，相当于this._game.$data.config
  _gameConfig = null
  // 缓存，很多东西不需要再计算
  _cache = {}

  /**
   * 构造函数
   * @param {Game} game 与Game对象绑定，注入到Game.$data全局数据中 
   */
  constructor (game) {
    game.$data.utils = this
    this._game = game
    this._gameConfig = game.$data.config
  }

  // 获取常见的位置、尺寸、空间信息
  getPosData () {
    if (this._cache.posData) { return this._cache.posData }

    const canvasWidth = this._game.$options.width
    const canvasHeight = this._game.$options.height
    const { containerWidth, containerHeight, containerBorderWidth, judgeToBottom, judgeAreaSize } = this._gameConfig
    // 容器的高度在判定线以上
    const trueHeight = containerHeight - judgeToBottom
    const trueWidth = containerWidth * (trueHeight / containerHeight)
    // 有效宽度要排除边框
    const effWidth = trueWidth - 2 * containerBorderWidth
    const effHeight = Utils.AFFINE_FACTOR * trueHeight
    // 计算仿射变换参照点
    const ratio = Utils.AFFINE_FACTOR > 1 ?
      Utils.AFFINE_FACTOR / (Utils.AFFINE_FACTOR - 1) : 2
    const affinePoint = new Point(0, trueHeight * ratio)
    // 计算顶部缩放后的宽度
    const topEffWidth = effWidth * (1 / Utils.AFFINE_FACTOR)   
    
    const res = {
      // 画布宽高 canvasWidth, canvasHeight
      canvasWidth, canvasHeight,
      // 容器宽高 containerWidth, containerHeight 取config中的设定值
      containerWidth, containerHeight,
      // 判定线距离底部高度 judgeToBottom 取config中的设定值
      // 判定区宽度 judgeAreaSize 取config中的设定值
      judgeToBottom, judgeAreaSize,
      // 真实宽度 trueWidth - 真实的容器的宽度，不是底部宽度，而是判定线处的宽度(仿射变换后)
      // 真实高度 trueHeight - 真实的容器高度，减掉判定线高度后的值(仿射变换后)
      trueHeight, trueWidth,
      // 有效宽度 effWidth - 在X方向上，排除边框，允许落键的范围
      // 有效高度 effHeight - 在Y方向上，按键下落到判定线处所走过的真实路程(仿射变换前)
      // 顶部有效宽度 topEffWidth - effWidth在顶部经过仿射变换后的宽度
      effWidth, effHeight, topEffWidth,
      // 仿射变换参照点 affinePoint
      affinePoint
    }
    this._cache.posData = res
    return res
  }
    
  // 获取标准运动参数
  getMoveData () {
    if (this._cache.moveData) { return this._cache.moveData }

    const { noteSpeed, noteMoveTime } = this._gameConfig
    const { effHeight } = this.getPosData()
    
    // 由速度设定决定的真实下落时间
    const tNoteMove = noteMoveTime * (1 - (noteSpeed - 1) * Utils.SPEED_TIME_FACTOR)
    // 标准下落速度
    const vStandard = effHeight / tNoteMove
    
    const res = {
      noteSpeed, noteMoveTime,
      tNoteMove, vStandard
    }
    this._cache.moveData = res
    return res
  }

  // 获取每种类型的按键独特配置
  getNoteUnique (type) {
    if (!this.isValidNoteType(type)) {
      throw new Error('Invalid note type!')
    }

    if (!this._cache.noteUnique) { this._cache.noteUnique = {} }

    if (this._cache.noteUnique[type]) { return this._cache.noteUnique[type] }

    let res = {}
    // 按照独特配置项key的独特格式取出配置
    const typeKey = '_' + type
    const uniqueKeys = Object.keys(this._gameConfig).filter(key => key.indexOf(typeKey) >= 0)
    uniqueKeys.forEach((key) => {
      const keyArr = key.split('_')
      res[keyArr[0]] = this._gameConfig[key]
    })
    this._cache.noteUnique[type] = res
    return res
  }

  // 获取判定数据，0/1/2/3/-1分别代表 大P/小P/Good/Bad/Miss
  getJudgeData (level = -1) {
    // 限定level的范围，超限的按-1处理
    if (!Validator.isInt(level) || level < -1 || level > 3) { level = -1 }

    if (!this._cache.judgeData) { this._cache.judgeData = {} }

    if (this._cache.judgeData[level]) { return this._cache.judgeData[level] }

    const index = level === -1 ? this._gameConfig.judgeTime.length : level
    const res = {
      time: this._gameConfig.judgeTime[index],
      scorePercent: this._gameConfig.judgeScorePercent[index],
      animationSrc: this._gameConfig.judgeAnimationSrc[index],
      txtSrc: this._gameConfig.judgeTxtSrc[index]
    }

    this._cache.judgeData[level] = res
    return res
  }

  // 静态版本
  static isValidNoteType (type) { return Object.values(NOTE_TYPES).indexOf(type) >= 0 }
  // prototype版本
  isValidNoteType (type) { return Utils.isValidNoteType(type) }

  /*
    将原始X坐标转换为有效X坐标
    原始X坐标 - X轴以游戏区域最左侧为原点，向右为正方向
    有效X坐标 - 以container的锚点anchor为原点，即判定线的中心点为原点，正方向向右
  */
  raw2EffX (rawX) {
    const { containerWidth } = this.getPosData()
    return rawX - containerWidth / 2
  }
  eff2RawX (effX) {
    const { containerWidth } = this.getPosData()
    return effX + containerWidth / 2
  }
  
  /*
    将原始Y坐标转换为有效Y坐标
    原始Y坐标 - 以游戏区域顶部为原点，正方向向下
    有效Y坐标 - 以container的锚点anchor为原点，即判定线的中心点为原点，正方向向下
  */
  raw2EffY (rawY) {
    const { effHeight } = this.getPosData()
    return rawY - effHeight
  }
  eff2RawY (effY) {
    const { effHeight } = this.getPosData()
    return effY + effHeight
  }
  
  // 求解线性关系，求y = kx + b
  getLinear (x1, y1, x2, y2) {
    const k = (y1 - y2) / (x1 - x2)
    const b = y1 - k * x1
    return { k, b }
  }

  // 获取divide分音符的时值
  getNoteDuration (divide = 4, bpm = 100) {
    // BPM的意义是一分钟4分音符的数量，先计算出4分音符的长度
    const baseDuration = 60 * 1000 / bpm
    const ratio = 4 / divide
    return baseDuration * ratio
  }
}
