<!--
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-01 10:56:48
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-09 17:11:11
-->
# 2021/3/1
## 本包改动 

## 依赖改动
### @cmjs 1.0.2
- 修改了@cmjs/utils-validator，不再提供_proxyObj和_rawObj的引用
- 修改了@cmjs/utils-validator，将_options的三个参数isValidateImmediately、isWarn、isDefaultReplace的默认值变为true
- 修改了@cmjs/utils-validator，类型验证的bug
### @cmgl 1.0.2
- 修改了@cmgl/vue-pixi-core，对应上一条修改，gameOptionsValidator将采用默认参数
- 修改了@cmgl/tween，当动画名为字符串时报错的BUG