<!--
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-01 09:54:13
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-12 10:47:40
-->
<template>
  <LoadingScene v-if="isLoading" ref="loadingScene" @finish="loadingFinishHandler"></LoadingScene>
  <GameScene v-if="isGame" ref="gameScene"></GameScene>
</template>

<script src="./App.js"></script>

<style>
</style>