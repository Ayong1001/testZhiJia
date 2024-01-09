<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="pageBox">
    <img src="/public/images/common/404.jpg" alt="">
    <van-button
      style="width: 100px"
      plain
      type="default"
      @click="router.go(-1)"
    >
      返 回
    </van-button>
  </div>
</template>

<style lang="less" scoped>
.pageBox {
  width: 100vw;
  height: 100vh;
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  img {
    width: 80%;
    object-fit: cover;
  }
}
</style>
