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

function initItem(data) {
  return data.map((item) => {
    item.data = null
    return item
  })
}
// 若为折叠面板时
const collapseValue = ['0']
function operate(type, index?) {
  if (type === 'add') {
    if (formConfig.text === '装修历史' && formConfig.dataList.length > 2) {
      showNotify('目前最多填加3条装修历史！')
      return
    }
    if (formConfig.text === '施工动态' && formConfig.dataList.length > 9) {
      showNotify('目前最多填加10条施工动态！')
      return
    }
    formConfig.dataList.push(initItem(formConfig.dataList[0]))
  }
  else if (type === 'del') {
    formConfig.dataList.splice(index, 1)
  }
}
function submit() {
  if (formConfig.type === 'default') {
    formRef.value.formRef
      .validate()
      .then(() => {
        request({
          url: formConfig.request.url,
          method: formConfig.request.methods,
          data: { data: formRef.value.formSubmit() },
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
  else if (formConfig.type === 'collapse') {
    request({
      url: formConfig.request.url,
      method: formConfig.request.methods,
      data: {
        data: formRef.value.map((item) => {
          return item.formSubmit()
        }),
      },
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
    <Form v-if="formConfig.type === 'default'" ref="formRef" :list="formConfig.dataList" :form-rules="formConfig.formRules" />
    <uni-section v-if="formConfig.type === 'collapse'" :title="formConfig.text" type="line">
      <uni-collapse v-model="collapseValue" accordion>
        <uni-collapse-item
          v-for="(collapseItem, collapseIndex) in formConfig.dataList"
          :key="collapseIndex"
        >
          <template #title>
            <uni-list>
              <uni-list-item :title="`装修历史-${collapseIndex + 1}`">
                <template v-if="collapseItem?.readonly !== true" #footer>
                  <text class="delBtn" @click.stop="operate('del', collapseIndex)">
                    删除
                  </text>
                </template>
              </uni-list-item>
            </uni-list>
          </template>
          <Form
            ref="formRef"
            :key="collapseItem.code"
            :list="[collapseItem]"
            :form-rules="formConfig.formRules"
          />
        </uni-collapse-item>
      </uni-collapse>
      <van-button
        size="mini"
        type="primary"
        class="addBtn"
        @click.stop="operate('add')"
      >
        新增{{ formConfig.text }}
      </van-button>
    </uni-section>
    <button class="formSubmit" @click="submit">
      提交
    </button>
  </div>
</template>

<style lang="less" scoped>
.main {
  width: 100%;
  .backImgBox {
    box-sizing: border-box;
    padding: 20rpx;
    background-color: #fff;
    .backImg {
      width: 50rpx;
      height: 50rpx;
      object-fit: cover;
      opacity: 1;
      transform: rotate(180deg);
    }
  }
  .addTitle {
    height: 120rpx;
    padding: 0 20rpx;
    position: relative;
    font-size: 36rpx;
    background-color: #fff;
    // border-bottom: 2rpx #dadada solid;
    display: flex;
    align-items: center;

    .addTitleLeft {
      display: flex;
      align-items: center;

      img {
        width: 50rpx;
        height: 50rpx;
        object-fit: cover;
        transform: rotate(180deg);
      }
    }

    .addTitleCenter {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .formSubmit {
    width: 100%;
    height: 100rpx;
    margin: 40rpx auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .delBtn {
    color: #e43d33;
  }
  .addBtn {
    margin: auto;
    margin: 20rpx 0;
  }
  ::v-deep .uni-section-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
