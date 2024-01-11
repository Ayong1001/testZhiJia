<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// import dataList from './listData'
import advImg from '@/assets/images/home/adv01.png'
import budgetImg from '@/assets/images/home/budget.png'
import editImg from '@/assets/images/home/edit-fill.png'
import locationImg from '@/assets/images/home/location-fill.png'
import securityImg from '@/assets/images/home/security-scan-fill.png'
import myLits from '@/components/common/list/index.vue'
import request from '@/utils/request'

const router = useRouter()

const btnList = [
  {
    name: '信息录入',
    route: 'add',
    url: editImg,
  },
  {
    name: '服务查询',
    route: 'service',
    url: securityImg,
  },
  {
    name: '装修预算',
    route: 'home',
    url: budgetImg,
  },
  {
    name: '获取定位',
    route: 'home',
    url: locationImg,
  },
]

// 主页数据
const dataList = ref()

function getList() {
  request.get('/worker/construction').then((res: any) => {
    if (res.success === true)
      dataList.value = res.data
  })
}
getList()

const activeName = ref()
</script>

<template>
  <div class="main">
    <div class="topBox">
      <p>智佳家装</p>
    </div>
    <div class="centerBox">
      <div class="btnBox">
        <div
          v-for="item in btnList"
          :key="item.route"
          class="btnItem"
          @click="router.replace(item.route)"
        >
          <div class="imgBox">
            <van-image :src="item.url" />
          </div>
          <p>{{ item.name }}</p>
        </div>
      </div>
      <div class="advBox">
        <van-image width="100%" height="100%" :src="advImg" />
      </div>
    </div>
    <div class="bottomBox">
      <div class="tabBox">
        <van-cell is-link>
          <template #icon>
            <van-icon size="32px" name="notes" color="#07c160" />
          </template>
          <template #title>
            <span class="title">施工动态</span>
          </template>
          <template #value>
            <span class="value">管理</span>
          </template>
        </van-cell>
      </div>
      <div class="contentBox">
        <myLits :get-list="getList">
          <template #cell="{ data }">
            <p>{{ data }}</p>
          </template>
        </myLits>
        <div class="listBox">
          <van-cell>
            <template #value>
              <div class="cellContent">
                <span>姓名</span>
                <span>施工地点</span>
                <span>进度</span>
              </div>
            </template>
          </van-cell>
          <van-collapse v-model="activeName" accordion>
            <van-collapse-item
              v-for="(item, index) in dataList"
              :key="index"
              :name="index"
            >
              <template #title>
                <div class="cellContent">
                  <span>{{ item.w_name || '' }}</span>
                  <span>{{ item.o_address || '' }}</span>
                  <span>{{ `${item.o_schedule || ''}%` }}</span>
                </div>
              </template>
              <van-cell title="姓名" :value="item.w_name" />
              <van-cell title="施工地点" :value="item.o_address" />
              <van-cell title="种类" :value="item.o_type" />
              <van-cell title="开工日期" :value="item.o_firstDate" />
              <van-cell title="预计完成日期" :value="item.o_lastDate" />
              <van-cell title="进度" :value="item.o_schedule" />
            </van-collapse-item>
          </van-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  .topBox {
    width: 100%;
    height: 200px;
    position: relative;
    background-image: url('@/assets/images/home/topImg.jpg');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    p {
      position: absolute;
      top: 20px;
      left: 20px;
      font-size: 26px;
      font-family: cursive;
      font-weight: bold;
    }
  }
  .centerBox {
    .btnBox {
      width: 100%;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .btnItem {
        display: flex;
        flex-direction: column;
        align-items: center;
        .imgBox {
          width: 32px;
          height: 32px;
          margin-bottom: 5px;
        }
        p {
          font-size: 13px;
        }
      }
    }
    .advBox {
      width: 100%;
      height: 100px;
    }
  }
  .bottomBox {
    margin-top: 10px;
    .tabBox {
      .title {
        display: block;
        margin-top: 5px;
        margin-left: 10px;
        font-size: 18px;
        color: black;
      }
      .van-cell {
        display: flex;
        align-items: center;
      }
    }
    .contentBox {
      .listBox {
        .cellContent {
          display: flex;
          justify-content: space-between;
        }
        :deep(.van-cell__title) {
          flex: 1 1 auto;
        }
        :deep(.van-cell__value) {
          flex: 1 1 auto;
        }
      }
    }
  }
}
</style>
