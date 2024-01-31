<script setup lang="ts" name="data-list">
import { ref } from 'vue'
import type HTTPResponseInterface from '@/types/request'

// 传入属性
const props = defineProps({
  getList: {
    type: Function,
    default: () =>
      function () {
        Promise.resolve({ success: true, data: [] })
      },
  },
  limit: {
    type: Number,
    default: 10,
  },
})

const list = ref<any[]>([]) // 列表数据
const page = ref(1) // 页码
const loading = ref(false) // 滑动加载动画
const finished = ref(false) // 数据是否加载完成
const refreshLoading = ref(false) // 下拉刷新加载动画

/**
 * 清除列表数据并重置分页配置
 */
function onRefresh() {
  finished.value = false
  loading.value = true
  onLoad(true)
}

/**
 * 获取列表数据
 * 是否重置数据,如不为false则在数组后追加数据
 */
function onLoad(reset = false) {
  // 是否重置分页配置
  if (reset) {
    page.value = 1
    list.value = []
    refreshLoading.value = false
  }

  // 获取数据
  props
    .getList({ page: page.value++, limit: props.limit })
    .then((res: HTTPResponseInterface<any>) => {
      const { success, data, message } = res

      if (success !== true)
        return Promise.reject(message)

      // 插入数据
      list.value = list.value.concat(data ?? data?.records ?? [])
      if (data?.records?.length < props.limit || data?.length < props.limit) {
        // 如果当前页数据尺寸小于分页尺寸,完全加载
        finished.value = true
      }
      else {
        // 其余情况,未完全加载
        finished.value = false
      }
    })
    .catch(() => {
    })
    .finally(() => {
      // 加载样式结束
      loading.value = false
    })
}

defineExpose({
  onRefresh,
  onLoad,
})
</script>

<template>
  <div class="myListBox">
    <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <slot :list-data="list" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<style lang="less" scoped>
.myListBox {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
</style>
