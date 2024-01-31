<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import request from '@/utils/request'
import Form from '@/components/common/service/form'

const formRef = ref(null)
const formConfig = ref({}) // 表单配置
onLoad((option) => {
  formConfig.value = JSON.parse(decodeURIComponent(option.formConfig))
})
// 消息提示
const popupRef = ref(null)
const popupList = {
  msgType: '',
  messageText: '',
}
function messageToggle(type, text) {
  popupList.msgType = type
  popupList.messageText = text
  popupRef.value.open()
}
function initItem(data) {
  return data.map((item) => {
    item.data = null
    return item
  })
}
// 若为折叠面板时
const collapseValue = ['0']
function operate(type, index) {
  if (type === 'add') {
    if (formConfig.value.text === '装修历史' && formConfig.value.dataList.length > 2) {
      messageToggle('error', '目前最多填加3条装修历史！')
      return
    }
    if (formConfig.value.text === '施工动态' && formConfig.value.dataList.length > 9) {
      messageToggle('error', '目前最多填加10条施工动态！')
      return
    }
    formConfig.value.dataList.push(initItem(formConfig.value.dataList[0]))
  }
  else if (type === 'del') {
    formConfig.value.dataList.splice(index, 1)
  }
}
function submit() {
  if (formConfig.value.type === 'default') {
    formRef.value.formRef
      .validate()
      .then(() => {
        request({
          url: formConfig.value.request.url,
          method: formConfig.value.request.methods,
          data: { data: formRef.value.formSubmit() },
        }).then((res) => {
          if (res.statusCode === 200) {
            messageToggle('success', '提交成功!')
            setTimeout(() => {
              backPage()
            }, 500)
          }
          else {
            messageToggle('error', '提交失败!')
          }
        })
      })
      .catch((err) => {
        messageToggle('error', err[0].errorMessage)
      })
  }
  else if (formConfig.value.type === 'collapse') {
    request({
      url: formConfig.value.request.url,
      method: formConfig.value.request.methods,
      data: {
        data: formRef.value.map((item) => {
          return item.formSubmit()
        }),
      },
    }).then((res) => {
      if (res.statusCode === 200) {
        messageToggle('success', '提交成功!')
        setTimeout(() => {
          backPage()
        }, 500)
      }
      else {
        messageToggle('error', '提交失败!')
      }
    })
  }
}
// 返回页面
function backPage() {
  uni.navigateBack({
    success: () => {
      uni.$emit('refresh')
    },
  })
}
</script>

<template>
  <div class="main">
    <div class="addTitle">
      <div class="addTitleLeft">
        <img src="/static/alicon/right.svg" mode="aspectFit" @click="backPage">
      </div>
      <div class="addTitleCenter">
        <text>编辑信息</text>
      </div>
    </div>
    <uni-section v-if="formConfig.type === 'default'" :title="formConfig.text" type="line">
      <Form ref="formRef" :list="formConfig.dataList" :form-rules="formConfig.formRules" />
    </uni-section>
    <uni-section v-if="formConfig.type === 'collapse'" :title="formConfig.text" type="line">
      <uni-collapse v-model="collapseValue" accordion @change="collapseChange">
        <uni-collapse-item
          v-for="(collapseItem, collapseIndex) in formConfig.dataList"
          :key="collapseIndex"
        >
          <template #title>
            <uni-list>
              <uni-list-item :title="`装修历史-${collapseIndex + 1}`">
                <template v-if="formConfig?.readOnly !== true" #footer>
                  <text class="delBtn" @click.stop="operate('del', collapseIndex)">
                    删除
                  </text>
                </template>
              </uni-list-item>
            </uni-list>
          </template>
          <Form
            ref="formRef"
            :key="collapseItem"
            :list="collapseItem"
            :form-rules="formConfig.formRules"
          />
        </uni-collapse-item>
      </uni-collapse>
      <button
        v-if="formConfig?.readOnly !== true"
        size="mini"
        type="primary"
        class="addBtn"
        @click.stop="operate('add')"
      >
        新增{{ formConfig.text }}
      </button>
    </uni-section>
    <button class="formSubmit" @click="submit">
      提交
    </button>
    <!-- 提示信息弹窗 -->
    <uni-popup ref="popupRef" type="message">
      <uni-popup-message
        :type="popupList.msgType"
        :message="popupList.messageText"
        :duration="2000"
      />
    </uni-popup>
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
