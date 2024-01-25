<script setup lang="ts" name="data-list">
import { reactive, ref } from 'vue'
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

const refreshLoading = ref(false) // 下拉刷新加载动画
const loading = ref(false) // 滑动加载动画
const finished = ref(false) // 数据是否加载完成
const error = ref(false) // 是否出现异常
const errorText = ref('') // 异常信息
const page = ref(0) // 页码
const list = ref<any[]>([]) // 列表数据

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
function onLoad(reset = refreshLoading.value) {
  // 是否重置分页配置
  if (reset) {
    page.value = 0
    list.value = []
    refreshLoading.value = false
  }

  // 清除异常信息
  error.value = false
  errorText.value = ''

  // 获取数据
  return props
    .getList({ page: ++page.value, limit: props.limit })
    .then((res: HTTPResponseInterface<any>) => {
      const { success, data, message } = res

      if (success !== true)
        return Promise.reject(message)

      // 插入数据
      Array.prototype.push.apply(
        list.value,
        (data?.records ?? data ?? []).map((o: never) => reactive(o)),
      )

      if (data?.records) {
        // 如果当前页数据尺寸小于分页尺寸,加载结束
        finished.value = data.records.length < props.limit
      }
      else {
        // 其余情况,加载结束
        finished.value = true
      }
    })
    .catch((err: Error) => {
      error.value = true
      errorText.value = err.message ?? err.toString()
    })
    .finally(() => {
      loading.value = false
    })
}

defineExpose({
  onRefresh,
  onLoad,
})
</script>

<template>
  <div class="overflow-auto h-full">
    <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh">
      <van-list
        v-bind="$attrs"
        v-model="loading"
        v-model:error="error"
        :finished="finished"
        finished-text="没有更多了"
        :error-text="errorText"
        @load="onLoad"
      >
        <slot :list-data="list" />
        <template #finished>
          <van-empty v-if="page === 1 && !list.length" description="暂无数据" />
          <span v-else>没有更多了</span>
        </template>
        <template #error>
          <van-empty
            v-if="page === 1 && !list.length"
            image="error"
            :description="errorText"
          />
          <span v-else>{{ errorText }}</span>
        </template>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
