<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showNotify } from 'vant'
import request from '@/utils/request'
import type { FormType } from '@/types/formType'
import Form from '@/components/common/form/index.vue'

const route = useRoute()
const router = useRouter()

const formConfig: FormType = JSON.parse(route.query.formConfig as string) // 表单配置

const formRef = ref(null) // 表单实例

function submit() {
  if (formConfig.type === 'default') {
    formRef.value.formRef
      .validate()
      .then(() => {
        request({
          url: formConfig.request.url,
          method: formConfig.request.methods,
          data: formRef.value.formSubmit(),
        }).then((res) => {
          if (res.success === true) {
            showNotify({ type: 'success', message: '提交成功!' })
            setTimeout(() => {
              router.go(-1)
            }, 500)
          }
          else {
            showNotify('提交失败!')
          }
        })
      })
      .catch((err) => {
        showNotify(err[0].errorMessage)
      })
  }
}
</script>

<template>
  <div class="main">
    <van-nav-bar
      title="编辑信息"
      left-text=""
      left-arrow
      @click-left="router.go(-1)"
    />
    <div class="formBox">
      <div v-if="formConfig.type === 'default'">
        <p class="title">
          {{ formConfig.text }}
        </p>
        <Form ref="formRef" :list="formConfig.dataList" />
      </div>
    </div>
    <div class="btnBox">
      <van-button round size="large" type="primary" @click="submit">
        提 交
      </van-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .formBox {
    flex: 1;
    padding-top: 20px;
    padding-bottom: 120px;
    .title {
      margin: var(--van-cell-group-inset-padding);
      margin-bottom: 10px;
    }
  }
  .btnBox {
    position: absolute;
    width: 80%;
    left: 50%;
    bottom: 50px;
    transform: translate(-50%, 0);
  }
}
</style>
