<!--
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-02-02 09:21:37
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-15 10:43:26
-->
<template>
  <Container>
    <Text :style="{ fill: 0xffffff, fontSize: 50 }" text="Loading..."
      :x="380" :y="400"></Text>
    <Text :style="{ fill: 0xffffff, fontSize: 30 }" :text="loadingTxt"
      :x="1560" :y="450" :anchorX="1" :anchorY="1"></Text>
    <ProgressBar :w="1200" :h="100"
      :pivotX="600" :pivotY="50"
      :x="screen.width / 2" :y="screen.height / 2"
      :radius="50" :progress="loadingProgress"
      :bgColor="0xccd1d9" :progressColor="0x007aff"></ProgressBar>
  </Container>
</template>

<script src="./LoadingScene.js"></script>