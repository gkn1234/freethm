/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-01 09:39:17
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-01 11:48:43
 */
// 系统配置
export function getDefaultSysOptions () {
  return {
    // 游戏渲染区域 canvas的设计宽高
    width: 1920,
    height: 1080,
    // 是否引入pixi-projection插件，默认引入
    pixiProjection: false,
    // pixiJS除了宽高以外的额外配置
    pixiOptions: {
      // 抗锯齿
      antialias: true,
      resolution: 1,
    },
  }
}

// 游戏配置
export function getDefaultGameOptions () {
  return {
    // 资源图集
    resources: '/assets.json',
    // 背景音乐
    bgm: '/bgm/a.mp3',
    // 背景图片
    bgImage: '/kldy.png',
    // 背景图片透明度
    bgImageAlpha: 0.5,
    
    // 轨道面板资源名称
    containerSrc: 'board.png',
    // 轨道的宽度
    containerWidth: 1920,
    // 轨道面板的高度
    containerHeight: 1080,
    // 音符面板的边框宽度，限制落键范围
    containerBorderWidth: 80,
    
    // 判定线资源名称
    judgeSrc: 'judge.png',
    // 判定线距离轨道底部的距离
    judgeToBottom: 144,
    // 有效判定区域的宽度
    judgeAreaSize: 900,
    
    // 各种按键和note的独特设置
    // Tap
    height_Tap: 60,
    src_Tap: ['tap_0.png', 'tap_1.png', 'tap_2.png'],
    // Slide
    height_Slide: 45,
    src_Slide: ['slide_0.png', 'slide_1.png', 'slide_2.png'],
    // Hold
    splitHeight_Hold: 20,
    arrowHeight_Hold: 120,
    src_Hold: ['hold_0.png', 'hold_1.png', 'hold_2.png'],
    splitSrc_Hold: ['hold_split_0.png', 'hold_split_1.png', 'hold_split_2.png'],
    arrowSrc_Hold: ['arrow_0.png', 'arrow_1.png', 'arrow_2.png'],
    // Swipe
    height_Swipe: 80,
    arrowHeight_Swipe: 120,
    src_Swipe: ['tap_0.png', 'tap_1.png', 'tap_2.png'],
    arrowSrc_Swipe: ['arrow_0.png', 'arrow_1.png', 'arrow_2.png'],
    
    // 运动参数
    // 键位从顶部到判定线用时(1速)，速度每加1，用时减去 3/28
    noteMoveTime: 2500,
    // 落键速度(可以设置1/2/3/4/5/6/7/8速)
    noteSpeed: 1,
    
    // 延迟参数
    // 歌曲播放前的空白时间，单位ms，即使不设置，也会强制空出3秒
    timeBeforeStart: 3000,
    // 按键延迟时间，正数代表按键延后(音乐提前)，负数代表按键提前(音乐延后)。该参数只影响音乐播放时间，不应该影响按键逻辑！！！
    startDelay: 0,
    
    // 判定区间，大P,小P,Good,Bad,Miss，小于第一个数字的是大P，注意这个值其实是+-x，判定区间大小为此值的两倍。不按照此规范赋值，程序将会发生不可预测的错误
    judgeTime: [0, 35, 70, 120, 150],
    // 判定得分比例，大P,小P,Good,Bad,Miss，大P为100%。不按照此规范赋值，程序将会发生不可预测的错误
    judgeScorePercent: [100, 90, 60, 30, 0],
    // 判定特效动画名称，大P,小P,Good,Bad,Miss。Miss没有判定特效，故显示空字符。不按照此规范赋值，程序将会发生不可预测的错误
    judgeAnimationSrc: ['perfect', 'perfect', 'good', 'bad', ''],
    // 判定文字动画，大P,小P,Good,Bad,Miss。不按照此规范赋值，程序将会发生不可预测的错误
    judgeTxtSrc: ['perfect0_txt.png', 'perfect1_txt.png', 'good_txt.png', 'bad_txt.png', 'miss_txt.png'],
    
    // 判定文字的大小、位置
    judgeTxtPos: {
      // 高度
      height: 60,
      // 中心相对于面板中点的偏移量
      centerX: 0,
      // 中心相对于顶部的偏移量
      top: 800
    },
    // 连击文字的大小、位置
    comboTxtPos: {
      // 尺寸
      titleHeight: 50, 
      numHeight: 100,
      // 位置
      right: 150,
      top: 600
    },
    // 分数结算的大小、位置
    scorePos: {
      height: 60,
      // x与y相对的原点为左上角
      x: 10,
      y: 10
    }
  }
}