<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { areaList } from '@vant/area-data'
import MyList from '@/components/common/list/index.vue'
import request from '@/utils/request'
import 'vant/lib/index.css'
import baseWorkTypeList from '@/utils/common/workTypeList'

const router = useRouter()

// 查询表单
const formData = reactive({
  w_habitualResidenceCity: '',
  w_typeWork: '',
})
function engineerClick(item) {
  router.push({
    name: `workerDetails`,
    query: { w_id: item.w_id },
  })
}
// 列表配置
const provinceIndex = ref(null) // 激活省份下标
const listConfig = [
  {
    name: '等级',
    listSolt: 'w_grade',
  },
  {
    name: '姓名',
    code: 'w_name',
  },
  {
    name: '年龄',
    code: 'w_age',
  },
  {
    name: '完工件数',
    code: 'w_completedQuantity',
  },
  {
    name: '目前状态',
    listSolt: 'state',
  },
]
// 初始化工种列表
const workTypeList = [
  {
    value: 0,
    text: '不限',
  },
].concat(JSON.parse(JSON.stringify(baseWorkTypeList)))
// 地址选择器参数
const pickers = reactive({
  isShow: false,
  type: null,
})
const myListRef = ref()
const activeAddress = computed(() => {
  if (formData.w_habitualResidenceCity.includes('-')) {
    return `${formData.w_habitualResidenceCity.split('-')[1]}-${
      formData.w_habitualResidenceCity.split('-')[2]
    }`
  }
  else { return '' }
})
// 默认地址数组
const defaultAddress = reactive([
  '四川省',
  '重庆市',
  '北京市',
  '上海市',
  '更多...',
])
// 筛选地址数据
const newAreaList = computed(() => {
  return {
    city_list: areaList.city_list,
    county_list: areaList.county_list,
    province_list: Object.fromEntries(
      Object.entries(areaList.province_list).filter(
        ([, value]) => value === defaultAddress[provinceIndex.value],
      ),
    ),
  }
})
// 颜色控制
const colorState = ref(false)
// 地址选择
function addressSelect(item, index) {
  defaultAddress[defaultAddress.length - 1] = '更多...'
  colorState.value = false
  provinceIndex.value = index
  formData.w_habitualResidenceCity = item
  myListRef.value.onRefresh()
}
function provinceChoose({ selectedOptions }) {
  defaultAddress[defaultAddress.length - 1] = selectedOptions[0].text
  provinceIndex.value = defaultAddress.length - 1
  colorState.value = true
  formData.w_habitualResidenceCity = selectedOptions[0].text
  pickers.isShow = false
  myListRef.value.onRefresh()
}
function addressChoose({ selectedOptions }) {
  formData.w_habitualResidenceCity = selectedOptions
    .map((item: any) => {
      return item.text
    })
    .join('-')
  pickers.isShow = false
  myListRef.value.onRefresh()
}
// 工种选择
const activeWorkerType = ref(0)
function chooseWorkerType(item, index) {
  if (index === 0) {
    activeWorkerType.value = index
    formData.w_typeWork = null
    myListRef.value.onRefresh()
    return
  }
  activeWorkerType.value = index
  formData.w_typeWork = item.text
  myListRef.value.onRefresh()
}

// 列表数据请求
function getList(params) {
  return request.get('/worker', { params: Object.assign(params, formData) })
}
</script>

<template>
  <div class="serviceContainer">
    <div class="serviceHeader">
      <div class="row">
        <div class="rowText1Box">
          <p
            v-for="(item, index) in defaultAddress.slice(0, 4)"
            :key="index"
            class="rowText1"
            :class="[provinceIndex === index ? `rowText1Active` : '']"
            @click="addressSelect(item, index)"
          >
            {{ item }}
          </p>
          <p class="rowText1" :class="[colorState ? `rowText1Active` : '']">
            {{ defaultAddress.slice(-1)[0] }}
          </p>
        </div>
        <div
          class="moreBox"
          @click="
            pickers.type = 1;
            pickers.isShow = true
          "
        >
          <img
            class="ListIcon"
            src="@/assets/images/service/list.svg"
            mode=""
          >
        </div>
      </div>
      <div class="otherBox">
        <div class="dropdownBox">
          <van-dropdown-menu
            :overlay="false"
            @click="
              pickers.type = 2;
              pickers.isShow = true
            "
          >
            <van-dropdown-item :title="activeAddress || '请选择地区'" />
          </van-dropdown-menu>
        </div>
        <div class="workerBox">
          <van-tag
            v-for="(item, index) in workTypeList"
            :key="index"
            :plain="activeWorkerType !== index"
            type="primary"
            @click="chooseWorkerType(item, index)"
          >
            {{ item.text }}
          </van-tag>
        </div>
      </div>
    </div>
    <div class="engineerTable">
      <!-- <van-cell>
        <div class="cellBox">
          <span v-for="(item, index) in listConfig" :key="item.name + index" class="cellItem">
            {{ item.name }}
          </span>
        </div>
      </van-cell> -->
      <div class="listBox">
        <MyList ref="myListRef" :get-list="getList">
          <template #default="{ listData }">
            <van-cell
              v-for="(listItem, listIndex) in listData"
              :key="listIndex"
              @click="engineerClick(listItem)"
            >
              <div class="cellBox">
                <div
                  v-for="(configItem, configIndex) in listConfig"
                  :key="listIndex + configIndex"
                  class="cellItem"
                >
                  <template v-if="configItem.listSolt === 'w_grade'">
                    <img
                      v-if="listItem.w_garde === '1'"
                      src="@/assets/images/service/gold.svg"
                      mode=""
                    >
                    <img
                      v-else-if="listItem.w_garde === '2'"
                      src="@/assets/images/service/silver.svg"
                      mode=""
                    >
                    <img
                      v-else
                      src="@/assets/images/service/bronze.svg"
                      mode=""
                    >
                  </template>
                  <template v-else-if="configItem.listSolt === 'state'">
                    <span v-if="listItem.w_state === 1">
                      正在施工
                    </span>
                    <span v-else-if="listItem.w_state === 0">
                      已完工
                    </span>
                    <span v-else>
                      空闲
                    </span>
                  </template>
                  <span v-else-if="configItem.code">{{
                    listItem[configItem.code] ?? ''
                  }}</span>
                </div>
              </div>
            </van-cell>
          </template>
        </MyList>
      </div>
    </div>
    <!-- 选择器弹窗 -->
    <van-popup v-model:show="pickers.isShow" position="bottom">
      <van-area
        v-if="pickers.type === 1"
        title="地区选择"
        :area-list="areaList"
        columns-num="1"
        @confirm="provinceChoose"
      />
      <van-area
        v-if="pickers.type === 2"
        title="地区选择"
        :area-list="newAreaList"
        @confirm="addressChoose"
      />
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.serviceContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .rowText1Active {
    color: #2979ff;
  }

  .serviceHeader {
    .row {
      padding: 0 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px #e9e9eb solid;

      .rowText1Box {
        flex: 1;
        display: flex;
        margin-right: 10px;
        align-items: center;
        justify-content: space-between;

        .rowText1 {
          font-size: 16px;
          max-width: 70px;
          text-align: center;
          font-weight: bold;
        }
      }

      .moreBox {
        img {
          width: 30px;
          height: 30px;
          object-fit: cover;
        }
      }

      .ListIcon {
        width: 60px;
        height: 60px;
        object-fit: cover;
      }
    }
    .otherBox {
      // height: 20px;
      margin: 10px 0;
      display: flex;
      .dropdownBox {
        flex: 1;
        margin: 0 5px;
        :deep(.van-dropdown-menu__bar) {
          height: 25px !important;
          background-color: var(--van-gray-2);
          box-shadow: none;
          .van-ellipsis {
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .workerBox {
        margin: 0 5px;
        width: 68%;
        overflow-x: scroll;
        overflow-y: hidden;
        display: flex;
        align-items: center;
        gap: 5px;
        flex-wrap: nowrap;
        :deep(.van-tag) {
          padding: 0 10px;
          height: 23px;
          white-space: nowrap;
        }
      }
    }
  }

  .engineerTable {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .listBox {
      flex: 1;
      overflow: hidden;
      .cellBox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .cellItem {
          flex: 1;
          display: flex;
          img {
            width: 35px;
            height: 35px;
          }
        }
      }
    }
  }
}
</style>
