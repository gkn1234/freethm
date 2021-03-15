<!--
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-12 11:10:24
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-15 09:35:29
-->
<template>
  <ReadyPopup v-if="isReady" @play="playHandler" @auto="autoHandler"></ReadyPopup>
</template>

<script src="./UILayer.js"></script>
