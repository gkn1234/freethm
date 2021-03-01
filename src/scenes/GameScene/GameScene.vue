<!--
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-02-04 16:28:43
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-02-04 19:15:14
-->
<template>
  <Container ref="scene">
    <!-- 背景图 -->
    <Sprite :width="bgImageStyle.width"
      :height="bgImageStyle.height"
      :texture="bgImageStyle.texture"
      :alpha="bgImageStyle.alpha"></Sprite>
    
    <!-- 轨道容器，包含轨道皮肤Sprite2d -->
    <Container2d ref="noteContainer" :x="noteContainerStyle.x" :y="noteContainerStyle.y">
      <Sprite2d v-pshow="isMainUIVisible"
        :anchorX="noteContainerSkinStyle.anchorX"
        :anchorY="noteContainerSkinStyle.anchorY"
        :width="noteContainerSkinStyle.width"
        :height="noteContainerSkinStyle.height"
        :texture="noteContainerSkinStyle.texture"></Sprite2d>
    </Container2d>

    <!-- 判定线 -->
    <Sprite v-pshow="isMainUIVisible"
      :x="judgeLineStyle.x" :y="judgeLineStyle.y"
      :anchorX="judgeLineStyle.anchorX"
      :anchorY="judgeLineStyle.anchorY"
      :width="judgeLineStyle.width"
      :height="judgeLineStyle.height"
      :texture="judgeLineStyle.texture"></Sprite>
  </Container>
</template>

<script src="./GameScene.js"></script>