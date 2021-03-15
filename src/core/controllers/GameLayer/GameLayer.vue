<!--
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-12 10:11:54
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-12 10:43:40
-->
<template>
  <Container>
    <!-- 背景图 -->
    <Sprite :width="bgImageStyle.width"
      :height="bgImageStyle.height"
      :texture="bgImageStyle.texture"
      :alpha="bgImageStyle.alpha"></Sprite>
    
    <!-- 轨道容器，包含轨道皮肤Sprite2d -->
    <Container2d ref="noteContainer" :x="noteContainerStyle.x" :y="noteContainerStyle.y">
      <Sprite2d v-pshow="isStageShow"
        :anchorX="noteContainerSkinStyle.anchorX"
        :anchorY="noteContainerSkinStyle.anchorY"
        :width="noteContainerSkinStyle.width"
        :height="noteContainerSkinStyle.height"
        :texture="noteContainerSkinStyle.texture"></Sprite2d>
    </Container2d>

    <!-- 判定线 -->
    <Sprite v-pshow="isStageShow"
      :x="judgeLineStyle.x" :y="judgeLineStyle.y"
      :anchorX="judgeLineStyle.anchorX"
      :anchorY="judgeLineStyle.anchorY"
      :width="judgeLineStyle.width"
      :height="judgeLineStyle.height"
      :texture="judgeLineStyle.texture"></Sprite>
  </Container>
</template>

<script src="./GameLayer.js"></script>
