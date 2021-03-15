/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-12 09:36:32
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-12 10:07:47
 */
// 游戏数据类，包括连击，积分等
export default class GameStat {
  // 游戏得分
  score = 0
  // 当前连击数
  combo = 0
  // 最大连击数
  maxCombo = 0
  // 判定统计，大P/小P/Good/Bad/Miss
  judgeNum = [0, 0, 0, 0, 0]

  
  constructor () {}

  // 初始化
  reset () {
    this.score = 0
    this.combo = 0
    this.maxCombo = 0
    this.judgeNum = [0, 0, 0, 0, 0]
  }
}