<!--
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-12 11:18:58
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-15 09:34:26
-->
<template>
  <Container>
    <!-- 蒙版 -->
    <Sprite :texture="maskTexture" :width="screen.width" :height="screen.height" :tint="0" :alpha="0.4"></Sprite>

    <!-- 带边框的歌曲封面 -->
    <Rectangle :w="size.imgWidth" :h="size.imgHeight"
      :anchorX="0.5" :x="screen.width / 2" :y="size.imgPadding"
      :bdWidth="5" :bdColor="0xffffff" :bgAlpha="0"></Rectangle>
    <Sprite :texture="startImgTexture"
      :width="size.imgWidth" :height="size.imgHeight"
      :anchorX="0.5" :x="screen.width / 2" :y="size.imgPadding"></Sprite>

    <!-- 歌曲标题 -->
    <Button :w="screen.width" :h="size.titleHeight"
      :x="screen.width / 2" :y="size.imgHeight + size.imgPadding * 2 + size.titleHeight / 2"
      :bgColor="0xb9e1ea" :bdWidth="10" :bdColor="0xffffff"
      text="ssssssss" :textSize="size.titleHeight / 2"></Button>

    <!-- 按钮 -->
    <Button :w="size.buttonWidth" :h="size.buttonHeight"
      :x="size.buttonPaddingSide + size.buttonWidth / 2" :y="screen.height - size.buttonPaddingBottom - size.buttonHeight / 2"
      :bgColor="0xccd1d9" :bdWidth="5" :bdColor="0xffffff" :radius="10"
      text="AUTO" :textSize="size.buttonHeight / 2"
      :hoverScale="1.1" :clickScale="0.9"
      @up="autoHandler"></Button>
    <Button :w="size.buttonWidth" :h="size.buttonHeight"
      :x="screen.width - size.buttonPaddingSide - size.buttonWidth / 2" :y="screen.height - size.buttonPaddingBottom - size.buttonHeight / 2"
      :bgColor="0xccd1d9" :bdWidth="5" :bdColor="0xffffff" :radius="10"
      text="PLAY" :textSize="size.buttonHeight / 2"
      :hoverScale="1.1" :clickScale="0.9"
      @up="playHandler"></Button>

  </Container>
</template>

<script src="./ReadyPopup.js"></script>