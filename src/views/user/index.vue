<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useStore } from '@/stores'

const router = useRouter()
const store = useStore()

const orderUserList = [
  {
    text: '导出账单',
  },
  {
    text: '输入邀请码',
  },
  {
    text: '关于我们',
  },
  {
    text: '注销账号',
  },
]
const toolUserList = [
  {
    text: '我的客户',
    imgUrl: new URL('@/assets/images/user/custom.svg', import.meta.url).href,
  },
  {
    text: '我的团队',
    imgUrl: new URL('@/assets/images/user/team.svg', import.meta.url).href,
  },
  {
    text: '我的增员',
    imgUrl: new URL('@/assets/images/user/addUser.svg', import.meta.url).href,
  },
  {
    text: '待处理',
    imgUrl: new URL('@/assets/images/user/file-text.svg', import.meta.url).href,
  },
  {
    text: '全部订单',
    imgUrl: new URL('@/assets/images/user/file.svg', import.meta.url).href,
  },
]

// 退出登录
function outLogin() {
  localStorage.removeItem('u_token')
  localStorage.removeItem('u_account')
  store.token = ''
  store.account = {}
  router.replace({ name: 'loginMain' })
}
</script>

<template>
  <div class="userContainer">
    <!-- <text class="title">我的</text> -->
    <div class="top">
      <img src="@/assets/images/user/user1.svg" mode="">
      <div class="userText">
        <text class="userDes">
          会员用户,到期时间2023.10.5
        </text>
        <text class="userName">
          高**
        </text>
      </div>
    </div>
    <img class="vip1" src="@/assets/images/user/vip1.png" mode="">
    <div class="apps">
      <div v-for="(item) in toolUserList" :key="item.imgUrl" class="appsItem">
        <img :src="item.imgUrl" mode="">
        <text>{{ item.text }}</text>
      </div>
    </div>
    <div class="tools">
      <van-field
        v-for="(item, index) in orderUserList"
        :key="item + index.toString()"
        is-link
        readonly
        :label="item.text"
      />
    </div>
    <div class="button-wrap">
      <div class="button-submit" @click.stop="outLogin">
        <span>退出登录</span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.userContainer {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;

  .title {
    font-size: 60px;
    margin: 20px 0;
  }

  .top {
    box-sizing: border-box;
    width: 100%;
    padding: 40px 20px 0 20px;
    display: flex;

    img {
      width: 50px;
      height: 50px;
    }

    .userText {
      margin-left: 20px;
      display: flex;
      flex-direction: column-reverse;

      .userName {
        font-size: 18px;
      }

      .userDes {
        font-size: 12px;
        color: #c7c9ce;
      }
    }
  }

  .vip1 {
    width: 100%;
    height: 100px;
    margin: 20px 0;
  }

  .apps {
    width: 100%;
    display: flex;
    justify-content: space-around;

    .appsItem {
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        width: 40px;
        height: 40px;
        margin-bottom: 10px;
      }

      text {
        font-size: 16px;
      }
    }
  }

  .tools {
    width: 100%;
    margin-top: 30px;
    border-top: 15px #e9e9eb solid;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .button-wrap {
      position: absolute;
      bottom: 40px;
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
}
</style>
