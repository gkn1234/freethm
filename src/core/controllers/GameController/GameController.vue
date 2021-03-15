<!--
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-03-12 10:44:46
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-15 09:47:29
-->
<template>
  <Container>
    <GameLayer :state="state"></GameLayer>
    <UILayer :state="state" @state-change="stateChangeHandler"></UILayer>    
  </Container>
</template>

<script src="./GameController.js"></script>
