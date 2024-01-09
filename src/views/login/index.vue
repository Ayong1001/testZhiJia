<template>
  <div class="container">
    <div class="viewBox">
      <RouterView />
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 100vw;
  height: 100vh;
  padding-top: 30px;
  position: relative;
  .viewBox {
    width: 100%;
    height: 100%;
    overflow: scroll;
  }
}
</style>
