<!--
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-02-07 17:23:29
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-15 09:31:18
-->
<template>
  <Container ref="container"
    v-gesture="gestureHandler"
    :pivotX="w / 2" :pivotY="h / 2">
    <slot name="bottom"></slot>
    <Rectangle v-if="rec"
      name="bgRec"
      :w="w" :h="h"
      :radius="radius"
      :bdWidth="bdWidth"
      :bdColor="bdColor"
      :bdAlpha="bdAlpha"
      :bdAlign="bdAlign"
      :bgColor="bgColor"
      :bgAlpha="bgAlpha"></Rectangle>
    <slot name="center"></slot>
    <Sprite v-if="bgTexture"
      name="bgSprite"
      :width="w" :height="h"
      :texture="bgTexture"></Sprite>
    <Text name="text"
      :text="text"
      :x="w / 2 + offsetX" :y="h / 2 + offsetY"
      :anchorX="0.5" :anchorY="0.5"
      :style="textStyle"></Text>
    <slot></slot>
  </Container>
</template>

<script src="./Button.js"></script>