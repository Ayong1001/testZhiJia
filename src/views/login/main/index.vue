<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showNotify } from 'vant'
import type { FormInstance } from 'vant'
import { useStore } from '@/stores'
import request from '@/utils/request'

const router = useRouter()
const store = useStore()

const formRef = ref<FormInstance>()

interface LoginType {
  u_username: string
  u_password: string
}
const formData = ref<LoginType>({
  u_username: '',
  u_password: '',
})

function submit(form) {
  request.post('/user/login', form).then((res: any) => {
    if (res.success === true) {
      localStorage.setItem('u_token', JSON.stringify(res.token))
      localStorage.setItem('u_account', JSON.stringify(res.data))
      store.token = res.token
      store.account = res.data
      router.replace({ name: 'home' })
    }
    else {
      showNotify(`登录失败：${res.message}`)
    }
  })
}
</script>

<template>
  <div class="page-container">
    <div class="login-wrap">
      <div class="form-wrap">
        <h1 class="title">
          智佳家居
        </h1>
        <div class="formBox">
          <van-form ref="formRef" @submit="submit">
            <van-field
              v-model="formData.u_username"
              name="u_username"
              label="用户名"
              placeholder="请填写用户名"
              :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
              v-model="formData.u_password"
              type="password"
              name="u_password"
              label="密码"
              placeholder="请填写密码"
              :rules="[{ required: true, message: '请填写密码' }]"
            />
          </van-form>
        </div>
        <div class="otherBox">
          <p @click="router.push('forgotPassword')">
            忘记密码
          </p>
          <p @click="router.push('forgotPassword')">
            注册账号
          </p>
        </div>
      </div>
      <div class="button-wrap">
        <div class="button-submit" @click="formRef.submit">
          <span>登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: url(/images/login/bg.jpg) var(--van-gray-1) no-repeat;
  background-size: 100% auto;
  .login-wrap {
    margin: 0 24px;
    width: 100%;
    .form-wrap {
      overflow: hidden;
      padding: 0 14px 30px 14px;
      background-color: white;
      box-shadow: 0 22px 52px 15px rgba(0, 0, 0, 0.1);
      border-radius: 4.8px;

      .formBox {
        border-top: 1px #0000000f solid;
        border-bottom: 1px #0000000f solid;
      }
      .otherBox {
        margin-top: 10px;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: var(--van-blue);
      }
      h1.title {
        margin: 20px 0;
        font-size: 20px;
        text-align: center;
        font-weight: normal;
      }
    }
    .button-wrap {
      position: relative;
      margin-top: 27px;
      .button-submit {
        position: relative;
        z-index: 1;
        margin: 0 auto;
        width: 159px;
        height: 49px;
        background-image: linear-gradient(90deg, #17ead9 0%, #6078ea 100%),
          linear-gradient(#445ee9, #445ee9);
        background-blend-mode: normal, normal;
        border-radius: 4.8px;
        text-align: center;
        line-height: 49px;
        font-size: 13px;
        color: white;
      }
      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 50%);
        z-index: 0;
        display: block;
        width: 126px;
        height: 14px;
        background-color: #35b3da;
        filter: blur(12px);
      }
    }
    .verify-code {
      & > span {
        margin: 02px;
        font-size: 2px;
      }
    }
  }
}
</style>
