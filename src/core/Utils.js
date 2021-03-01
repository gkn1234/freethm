import { Point } from 'pixi.js'

import { Game, Validator } from '@/libs/index.js'

let game, gameConfig

export default class Utils {
  constructor () {
    // 必要的初始化
    game = new Game()
    gameConfig = game.getUsed('gameConfig')
  }
  
  // 合法的按键类型，及其对应的构造函数
  static NOTE_TYPES = ['Tap', 'Slide', 'Swipe', 'Hold']
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
  
  /* 
    获取尺寸、位置信息
    画布宽高 canvasWidth, canvasHeight
    容器宽高 containerWidth, containerHeight 取config中的设定值
    判定线高度 judgeHeight 取config中的设定值
    真实宽度 trueWidth - 真实的容器的宽度，不是底部宽度，而是判定线处的宽度(仿射变换后)
    真实高度 trueHeight - 真实的容器高度，减掉判定线高度后的值(仿射变换后)
    有效宽度 effWidth - 在X方向上，排除边框，允许落键的范围
    有效高度 effHeight - 在Y方向上，按键下落到判定线处所走过的真实路程(仿射变换前)
    顶部有效宽度 topEffWidth - effWidth在顶部缩放的宽度.
    仿射变换参照点 affinePoint
  */
  static getPosData () {
    if (!Utils.posData) {
      const canvasWidth = game.$options.width
      const canvasHeight = game.$options.height
      const { containerWidth, containerHeight, containerBorderWidth, judgeToBottom, judgeAreaSize } = gameConfig
      
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
      
      Utils.posData = {
        canvasWidth, canvasHeight,
        containerWidth, containerHeight,
        judgeToBottom, judgeAreaSize,
        trueHeight, trueWidth,
        effWidth, effHeight, topEffWidth,
        affinePoint
      }
    }

    return Utils.posData
  }
  
  // 获取标准运动参数
  static getMoveData () {
    if (!Utils.moveData) {
      const { noteSpeed, noteMoveTime } = gameConfig
      const { effHeight } = Utils.getPosData()
      
      // 由速度设定决定的真实下落时间
      const tNoteMove = noteMoveTime * (1 - (noteSpeed - 1) * Utils.SPEED_TIME_FACTOR)
      // 标准下落速度
      const vStandard = effHeight / tNoteMove
      
      Utils.moveData = {
        noteSpeed, noteMoveTime,
        tNoteMove, vStandard
      }
    }
    return Utils.moveData
  }
  
  // 获取按键独特配置
  static getNoteUnique (type) {
    if (!Utils.noteUnique) { Utils.noteUnique = {} }
    
    if (!Utils.noteUnique[type]) {
      Utils.noteUnique[type] = {}
      const typeKey = '_' + type
      const uniqueKeys = Object.keys(gameConfig).filter(item => item.indexOf(typeKey) >= 0)
      uniqueKeys.forEach((item) => {
        const keyArr = item.split('_')
        Utils.noteUnique[type][keyArr[0]] = gameConfig[item]
      })      
    }
    return Utils.noteUnique[type]
  }

  // 从配置文件中获取判定数据，0/1/2/3/-1分别代表 大P/小P/Good/Bad/Miss
  static getJudgeData (level = -1) {
    if (!Validator.isValidInt(level) || level < -1 || level > 3) { level = -1 }

    if (!Utils.judgeData) { Utils.judgeData = {} }

    if (!Utils.judgeData[level]) {
      const index = level === -1 ? gameConfig.judgeTime.length : level
      Utils.judgeData[level] = {
        time: gameConfig.judgeTime[index],
        scorePercent: gameConfig.judgeScorePercent[index],
        animationSrc: gameConfig.judgeAnimationSrc[index],
        txtSrc: gameConfig.judgeTxtSrc[index]
      }
    }

    return Utils.judgeData[level]
  }
 
  // 按键类型是否合法
  static isValidNoteType (type) {
    return Utils.NOTE_TYPES.indexOf(type) >= 0
  }
  
  /*
    将原始X坐标转换为有效X坐标
    原始X坐标 - X轴以游戏区域最左侧为原点，向右为正方向
    有效X坐标 - 以container的锚点anchor为原点，即判定线的中心点为原点，正方向向右
  */
  static raw2EffX (rawX) {
    const { containerWidth } = Utils.getPosData()
    return rawX - containerWidth / 2
  }
  static eff2RawX (effX) {
    const { containerWidth } = Utils.getPosData()
    return effX + containerWidth / 2
  }
  
  /*
    将原始Y坐标转换为有效Y坐标
    原始Y坐标 - 以游戏区域顶部为原点，正方向向下
    有效Y坐标 - 以container的锚点anchor为原点，即判定线的中心点为原点，正方向向下
  */
  static raw2EffY (rawY) {
    const { effHeight } = Utils.getPosData()
    return rawY - effHeight
  }
  static eff2RawY (effY) {
    const { effHeight } = Utils.getPosData()
    return effY + effHeight
  }
  
  // 求解线性关系，求y = kx + b
  static getLinear (x1, y1, x2, y2) {
    const k = (y1 - y2) / (x1 - x2)
    const b = y1 - k * x1
    return { k, b }
  }

  // 获取divide分音符的时值
  static getNoteDuration (divide = 4, bpm = 100) {
    // BPM的意义是一分钟4分音符的数量，先计算出4分音符的长度
    const baseDuration = 60 * 1000 / bpm
    const ratio = 4 / divide
    return baseDuration * ratio
  }

  // 获取判定时间
  static
}

