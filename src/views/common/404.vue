<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="pageBox">
    <img src="/public/images/common/404.jpg" alt="">
    <div class="button-submit" @click="router.go(-1)">
      返 回
    </div>
  </div>
</template>

<style lang="less" scoped>
.pageBox {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background-color: #ffffff;
  img {
    width: 80%;
    object-fit: cover;
  }
  .button-submit {
    position: relative;
    z-index: 1;
    margin: 0 auto;
    width: 100px;
    height: 49px;
    background-image: linear-gradient(90deg, #ffffff 0%, #949494 100%),
      linear-gradient(#000000, #ffffff);
    background-blend-mode: normal, normal;
    border-radius: 48px;
    text-align: center;
    line-height: 49px;
    font-size: 13px;
    color: white;
  }
}
</style>
