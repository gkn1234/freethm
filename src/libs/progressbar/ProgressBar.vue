<!--
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-02-05 11:53:51
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-12 18:34:27
-->
<template>
  <Container>
    <!-- 进度条背景 -->
    <Sprite v-if="backgroundTexture"
      :texture="backgroundTexture"
      :width="w" :height="h"
      :x="w * 0.5" :y="h * 0.5"
      :anchorX="0.5" :anchorY="0.5"></Sprite>
    <Rectangle v-else 
      :radius="radius"
      :w="w" :h="h"
      :bdWidth="bdWidth"
      :bdColor="bdColor"
      :bdAlpha="bdAlpha"
      :bdAlign="bdAlign"
      :bgColor="bgColor"
      :bgAlpha="bgAlpha"></Rectangle>
    <!-- 进度条内容 -->
    <Sprite ref="progressSprite" v-if="progressTexture"
      :texture="progressTexture"
      :width="w * progressScaleX" :height="h * progressScaleY"
      :x="w * 0.5" :y="h * 0.5"
      :anchorX="0.5" :anchorY="0.5"></Sprite>
    <Rectangle ref="progressRec" v-else 
      :radius="radius"
      :w="w" :h="h"
      :scaleX="progressScaleX" :scaleY="progressScaleY"
      :x="w * 0.5" :y="h * 0.5"
      :pivotX="w * 0.5" :pivotY="h * 0.5"
      :bgColor="progressColor"
      :bgAlpha="progressAlpha"></Rectangle>
    <!-- 进度条遮罩 -->
    <Rectangle ref="progressMask"
      :radius="radius"
      :w="w * progress / 100" :h="h"
      :scaleX="progressScaleX" :scaleY="progressScaleY"
      :x="w * 0.5" :y="h * 0.5"
      :pivotX="w * 0.5" :pivotY="h * 0.5"
      :bgColor="0"></Rectangle>
    
    <slot></slot>
  </Container>
</template>

<script src="./ProgressBar.js"></script>