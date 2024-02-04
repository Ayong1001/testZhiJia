<script setup lang="ts">
import { useStore } from '@/stores'
import { localStorage } from '@/utils/local-storage'

const store = useStore()
const themeStore = localStorage.get('theme')
const checked = ref<boolean>(themeStore === 'dark')
watch(checked, (val) => {
  if (val) {
    store.mode = 'dark'
    localStorage.set('theme', 'dark')
  }
  else {
    store.mode = 'light'
    localStorage.set('theme', 'light')
  }
})
</script>

<template>
  <div class="container">
    <div class="viewBox">
      <RouterView v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </div>
    <van-tabbar route>
      <van-tabbar-item replace to="/home" icon="wap-home">
        首页
      </van-tabbar-item>
      <van-tabbar-item replace to="/add" icon="records">
        录入
      </van-tabbar-item>
      <van-tabbar-item replace to="/service" icon="award">
        服务
      </van-tabbar-item>
      <van-tabbar-item replace to="/user" icon="user">
        个人中心
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 100vw;
  height: 100vh;
  position: relative;
  .viewBox {
    width: 100%;
    height: calc(100% - var(--van-tabbar-height));
    overflow: scroll;
  }
}
</style>
