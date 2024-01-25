<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { List } from 'vant'
import request from '@/utils/request'
import 'vant/lib/index.css'
import baseWorkTypeList from '@/utils/common/workTypeList'

// eslint-disable-next-line import/order
import { areaList } from '@vant/area-data'

const router = useRouter()

const provinceIndex = ref(0) // 省份下标
const loading = ref(false)
const finished = ref(false)
// 查询表单
const formData = reactive({
  address: '四川省',
  workType: '',
})
const engineerList = ref([])
function engineerClick(item) {
  router.push({
    name: `asdqwe`,
    params: { w_id: item.w_id },
  })
}
// 默认地址数组
const defaultAddress = reactive([
  {
    id: '510000',
    name: '四川省',
  },
  {
    id: '500000',
    name: '重庆市',
  },
  {
    id: '110000',
    name: '北京市',
  },
  {
    id: '310000',
    name: '上海市',
  },
  {
    id: '',
    name: '更多...',
  },
])
// 选择器参数
const pickers = reactive({
  isShow: false,
  showCode: '',
  typeWorkColumns: [
    {
      value: 0,
      text: '不限',
    },
  ].concat(JSON.parse(JSON.stringify(baseWorkTypeList))),
})
// 通用选择器
function onConfirm(e) {
  switch (pickers.showCode) {
    case 'workType':
      formData[pickers.showCode] = e.selectedOptions[0].text
      break
    case 'address':
      formData[pickers.showCode] = e.selectedOptions.map((item: any) => {
        return item.text
      }).join('-')
      break
    default:
      formData[pickers.showCode] = e.selectedOptions[0].value
      break
  }
  pickers.isShow = false
}

const colorState = ref(false)
const AddressPickerRef = ref(null)
const addressText = ref('')

function addressSelect(item, index) {
  addressText.value = ''
  defaultAddress[defaultAddress.length - 1].name = '更多...'
  AddressPickerRef.value.baseAddressChange(item.id)
  colorState.value = false
  provinceIndex.value = index
  formData.address = item.name
  engineerList.value = []
  clickLoadMore()
}

// 颜色控制
function trBGColor(item) {
  if (item.state === 1)
    return '#fad8d6'
  else if (item.state === 2)
    return '#fdedd9'
  else return '#d1f2d7'
}
// 详细地址选择器
function permanentAddressChange(result) {
  addressText.value = ''
  result.splice(0, 1)
  result.forEach((item, index) => {
    if (index === 0) {
      addressText.value += item.name
      formData.address += `-${item.name}`
    }
    else {
      formData.address += `-${item.name}`
      addressText.value += item.name
    }
  })
  page = 1
  engineerList.value = []
  clickLoadMore()
}
// 列表数据请求
function clickLoadMore() {
  request.get('/worker', {
    w_typeWork: formData.workType,
    w_habitualResidenceCity: formData.address,
  }).then((res) => {
    if (res.statusCode !== 200 || res.data.data.length === 0) {
      loading.value = false
      finished.value = true
    }
    else {
      res.data.data.forEach((item) => {
        engineerList.value.push(item)
      })
      page += 1
      loading.value = false
    }
  })
}

onMounted(() => {})
</script>

<template>
  <div class="serviceContainer">
    <div class="serviceHeader">
      <div class="row">
        <div class="rowText1Box">
          <p
            v-for="(item, index) in defaultAddress.slice(0, 4)" :key="index" class="rowText1"
            :class="[provinceIndex === index ? `rowText1Active` : '']"
            @click="addressSelect(item, index)"
          >
            {{ item.name }}
          </p>
          <p class="rowText1" :class="[colorState ? `rowText1Active` : '']">
            {{
              defaultAddress.slice(-1)[0].name
            }}
          </p>
        </div>
        <div class="moreBox">
          <img class="ListIcon" src="@/assets/images/service/list.svg" mode="">
        </div>
      </div>
      <div class="row">
        <div class="addressText">
          <div class="addressPicker">
            <AddressPicker
              ref="AddressPickerRef"
              :base-code="defaultAddress[0].id"
              @change="permanentAddressChange"
            >
              {{ addressText || '请选择地址' }}
            </AddressPicker>
          </div>
          <uni-icons class="addressPickerIcon" type="bottom" size="10" />
        </div>
        <uni-data-checkbox
          v-model="defWorkTypeIndex"
          class="workTypeCheckbox"
          mode="tag"
          :localdata="workTypeList"
          selected-color="#2979ff"
          @change="workTypeChange"
        />
      </div>
    </div>
    <div class="engineerTable">
      <List
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="clickLoadMore"
      >
        <uni-table stripe empty-text="" style="height: 100%">
          <!-- 表头行 -->
          <uni-tr class="trStyle" height="60">
            <uni-th width="30" align="center">
              排名
            </uni-th>
            <uni-th width="40" align="center">
              等级
            </uni-th>
            <uni-th width="50" align="center">
              姓名
            </uni-th>
            <uni-th width="30" align="center">
              年龄
            </uni-th>
            <uni-th width="50" align="center">
              完工件数
            </uni-th>
            <uni-th width="50" align="center">
              目前状态
            </uni-th>
          </uni-tr>
          <!-- 表格数据行 -->
          <uni-tr
            v-for="(item, index) in engineerList"
            :key="index"
            :style="{ backgroundColor: `${trBGColor(item)}` }"
            @click="engineerClick(item)"
          >
            <uni-td align="center">
              {{ index + 1 }}
            </uni-td>
            <uni-td class="imgTd" align="center">
              <img v-if="item.w_grade === 1" src="@/assets/images/service/gold.svg" mode="">
              <img
                v-else-if="item.w_grade === 2"
                src="@/assets/images/service/silver.svg"
                mode=""
              >
              <img v-else src="@/assets/images/service/bronze.svg" mode="">
            </uni-td>
            <uni-td align="center">
              {{ item.w_name }}
            </uni-td>
            <uni-td align="center">
              {{ item.w_age }}
            </uni-td>
            <uni-td align="center">
              {{ item.w_completedQuantity }}
            </uni-td>
            <uni-td align="center">
              <p v-if="item.state === 1">
                正在施工
              </p>
              <p v-else-if="item.state === 0">
                已完工
              </p>
              <p v-else>
                空闲
              </p>
            </uni-td>
          </uni-tr>
        </uni-table>
      </List>
    </div>
    <!-- 选择器弹窗 -->
    <van-popup v-model:show="pickers.isShow" position="bottom">
      <van-picker
        v-if="pickers.showCode === 'w_typeWork'"
        :columns="pickers.typeWorkColumns"
        @confirm="onConfirm"
        @cancel="pickers.isShow = false"
      />
      <van-area
        v-if="pickers.showCode === 'address'" title="选择地区" :area-list="areaList" @confirm="onConfirm"
        @cancel="pickers.isShow = false"
      />
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.serviceContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  // background-img: url('@/static/img/home/BG1.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .rowText1Active {
    color: #2979ff;
  }

  .serviceHeader {
    .row {
      padding: 0 20px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px #e9e9eb solid;

      .rowText1Box {
        flex: 1;
        display: flex;
        margin-right: 20px;
        align-items: center;
        justify-content: space-between;

        .rowText1 {
          max-width: 120px;
          text-align: center;
          font-weight: bold;
        }
      }

      .moreBox {
        img {
          width: 50px;
          height: 50px;
          object-fit: cover;
        }
      }

      .addressText {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .addressPicker {
          max-width: 200px;
          overflow: hidden;
          font-size: 28px;
          white-space: nowrap;
          font-weight: bold;
        }

        .addressPickerIcon {
          margin-left: 20px;
        }
      }

      .ListIcon {
        width: 60px;
        height: 60px;
        object-fit: cover;
      }

      .workTypeCheckbox {
        flex: 1;
        margin-left: 20px;

        ::v-deep .checklist-group {
          width: 520px;
          flex-wrap: nowrap;
          align-items: center;
          overflow: scroll;

          .checklist-box {
            display: inline-table;
            min-width: 60px;
          }

          .checklist-text {
            white-space: nowrap;
          }
        }
      }

      ::v-deep .uni-mt-10 {
        width: 400px;
        margin-top: 0;
        align-items: center;
      }
    }
  }

  .engineerTable {
    flex: 1;
    overflow: auto;
    border-radius: 10px;
    // ::v-deep .uni-table {
    //   height: 100%;
    // }

    .trStyle {
      background-color: #00000012;
    }

    .imgTd {
      display: flex;
      align-items: center;
      justify-content: center;
      // border-bottom: 0;

      img {
        width: 50px;
        height: 50px;
      }
    }

    ::v-deep .uni-table-th {
      padding: 24px 12px;
    }

    ::v-deep .uni-table-td {
      padding: 8px 0;
    }
  }
}
</style>
