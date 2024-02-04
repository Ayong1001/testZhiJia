<script setup>
import { showConfirmDialog, showNotify } from 'vant'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import moment from 'moment'
import workTypeList from '@/utils/common/workTypeList'
import request from '@/utils/request'
import Screenshot1 from '@/assets/images/worker/Screenshot1.png'

const route = useRoute()
const router = useRouter()

const workerData = ref({})
const historyList = ref([])
const priceList = ref({})
const active = ref(0)
// 请求基本信息数据
function getWorker() {
  request
    .get('/worker/id', {
      params: {
        w_id: route.query.w_id,
      },
    })
    .then((res) => {
      if (res.success === true)
        workerData.value = res.data
    })
}
function getHistoryorder() {
  // 请求装修历史数据
  request
    .get('/worker/historyorder', {
      params: {
        w_id: route.query.w_id,
      },
    })
    .then((res) => {
      if (res.success === true)
        historyList.value = res.data
    })
}
function getPrices() {
  // 请求参考价格数据
  request
    .get('/worker/prices', {
      params: {
        w_id: route.query.w_id,
      },
    })
    .then((res) => {
      if (res.success === true)
        priceList.value = res.data
    })
}

const baseMessageList = [
  {
    id: 'w_habitualResidenceCity',
    name: '地区',
  },
  {
    id: 'w_birthday',
    name: '出生日期',
  },
  {
    id: 'w_completedQuantity',
    name: '完工次数',
  },
  {
    id: 'w_typeWork',
    name: '工种类别',
  },
  {
    id: 'w_seniority',
    name: '工龄',
  },
  {
    id: 'w_garde',
    name: '等级',
  },
]

// 编辑信息
function editClick(type, data) {
  const pickerList = workTypeList.map((item) => {
    return item.span
  })
  // 传入表单数据
  const formConfig1 = () => {
    return {
      type: 'default',
      text: '基本信息',
      dataList: [
        {
          type: 'input',
          text: '工人姓名',
          code: 'w_name',
          data: workerData.value.w_name,
        },
        {
          type: 'picker',
          text: '工种',
          code: 'w_typeWork',
          data: workerData.value.w_typeWork,
          dataConfig: {
            dataList: pickerList,
          },
        },
        {
          type: 'datePicker',
          text: '出生日期',
          code: 'w_birthday',
          data: workerData.value.w_birthday,
        },
        {
          type: 'input',
          text: '工龄',
          code: 'w_seniority',
          data: workerData.value.w_seniority,
          disabled: true,
        },
        {
          type: 'picker',
          text: '师傅等级',
          code: 'w_garde',
          data: workerData.value.w_garde,
          dataConfig: {
            dataList: [
              {
                value: 0,
                text: '铜牌师傅',
              },
              {
                value: 1,
                text: '金牌师傅',
              },
              {
                value: 2,
                text: '银牌师傅',
              },
            ],
            dataListText: 'text',
          },
        },
        {
          type: 'input',
          text: '完工件数',
          code: 'w_completedQuantity',
          data: workerData.value.w_completedQuantity,
        },
        {
          type: 'input',
          text: '施工单价',
          code: 'w_price',
          data: workerData.value.w_price,
        },
        {
          type: 'addressPicker',
          text: '所在地区',
          code: 'w_habitualResidenceCity',
          data: workerData.value.w_habitualResidenceCity,
        },
        {
          type: 'otherData',
          text: '工人id',
          code: 'w_id',
          data: w_id,
        },
      ],
      formRules: {
        // 对name字段进行必填验证
        w_name: {
          rules: [
            {
              required: true,
              errorMessage: '请输入姓名',
            },
            {
              minLength: 2,
              maxLength: 8,
              errorMessage: '姓名长度在 {minLength} 到 {maxLength} 个字符',
            },
          ],
        },
        // 对性别进行验证
        w_sex: {
          rules: [
            {
              required: true,
              errorMessage: '请选择性别',
            },
          ],
        },
        // 对手机号码进行验证
        w_phone: {
          rules: [
            {
              required: true,
              errorMessage: '请输入手机号码',
            },
            {
              pattern: '^1[3-9]\\d{9}$',
              errorMessage: '请输入正确的手机号码',
            },
          ],
        },
        // 对常住地进行验证
        w_habitualResidenceCity: {
          rules: [
            {
              required: true,
              errorMessage: '请填写常住地',
            },
          ],
        },
      },
      request: {
        url: '/worker/update',
        methods: 'PUT',
      },
    }
  }
  const formConfig2 = (data) => {
    return {
      type: 'default',
      text: '装修历史',
      dataList: [
        {
          type: 'input',
          text: '施工项目',
          code: 'o_address',
          data: data?.o_address || null,
        },
        {
          type: 'datePicker',
          text: '施工年份',
          code: 'o_date',
          data: data?.o_date || null,
        },
        {
          type: 'input',
          text: '施工所在地区',
          code: 'o_area',
          data: data?.o_area || null,
        },
        {
          type: 'picker',
          text: '师傅等级',
          code: 'o_garde',
          data: data?.o_garde || null,
          dataConfig: {
            dataList: [
              {
                value: 0,
                text: '铜牌师傅',
              },
              {
                value: 1,
                text: '金牌师傅',
              },
              {
                value: 2,
                text: '银牌师傅',
              },
            ],
            dataListText: 'text',
          },
        },
        {
          type: 'input',
          text: '施工价格',
          code: 'o_price',
          data: data?.o_price || null,
        },
        {
          type: 'otherData',
          text: '项目id',
          code: 'o_id',
          data: data?.o_id || null,
        },
        {
          type: 'otherData',
          text: '工人id',
          code: 'w_id',
          data: w_id,
        },
      ],
      request: data
        ? {
            url: '/order/updateHistoryOrder',
            methods: 'PUT',
          }
        : {
            url: `/order/add`,
            methods: 'POST',
          },
    }
  }
  const formConfig3 = () => {
    return {
      type: 'default',
      text: '参考价格',
      dataList: [
        {
          type: 'input',
          text: '历史最低单价',
          code: 'w_historyPrice',
          data: priceList.value.w_historyPrice,
        },
        {
          type: 'input',
          text: '目前施工单价',
          code: 'w_price',
          data: priceList.value.w_price,
        },
        {
          type: 'otherData',
          text: '工人id',
          code: 'w_id',
          data: w_id,
        },
      ],
      request: {
        url: '/worker/updateprices',
        methods: 'PUT',
      },
    }
  }
  let formConfig = {}
  if (type === 1)
    formConfig = formConfig1()
  else if (type === 2)
    formConfig = formConfig2()
  else if (type === 3)
    formConfig = formConfig3()
  else if (type === 4)
    formConfig = formConfig2(data)

  // 带数据跳转信息编辑页
  uni.navigateTo({
    url: `/components/private/workerEdit/index?formConfig=${JSON.stringify(
      formConfig,
    )}`,
  })
}
// 编辑、删除按钮
function btnClick(type, item) {
  switch (type) {
    case 'delHistory':
      showConfirmDialog({
        title: '警告',
        message:
    '删除此项后不可恢复，是否确认？',
      })
        .then(() => {
          // on confirm
          request.delete(
            `/order/delete?o_id=${item.o_id}`,
          ).then((res) => {
            if (res.success === true) {
              showNotify({ type: 'success', message: '删除成功!' })
              setTimeout(() => {
                getHistoryorder()
              }, 500)
            }
            else {
              showNotify({ type: 'danger', message: '删除失败!' })
            }
          })
        })
        .catch(() => {
          // on cancel
        })
      break

    default:
      break
  }
}

onMounted(() => {
  getWorker()
  getHistoryorder()
  getPrices()
})
</script>

<template>
  <div v-if="workerData.w_id" class="userContainer">
    <div class="top">
      <van-nav-bar
        title="详细信息"
        left-text=""
        left-arrow
        @click-left="router.go(-1)"
      />
      <div class="userBox">
        <van-card :price="`${workerData.w_price}.00`" desc="" :thumb="workerData.w_picture ? workerData.w_picture : Screenshot1">
          <template #title>
            <div class="titleBox">
              <span class="title">{{ workerData.w_name ? workerData.w_name : '* 先生' }}</span>
              <div class="workerType">
                <van-tag plain type="primary">
                  瓦工
                </van-tag>
                <van-tag plain type="primary">
                  木工
                </van-tag>
              </div>
            </div>
          </template>
          <template #desc>
            <p>{{ `${moment().year() - workerData.w_birthday?.split('-')[0]}岁 / ${workerData.w_seniority ?? '*'}年工龄 / ${workerData.w_habitualResidence ?? '*'}` }}</p>
            <p>累计完工：{{ workerData.w_completedQuantity ?? '*' }} /次</p>
          </template>
          <template #bottom>
            /小时
          </template>
          <template #footer>
            <van-icon name="weapp-nav" />
          </template>
        </van-card>
      </div>
    </div>
    <div class="bottom">
      <van-tabs
        v-model:active="active"
        sticky
        scrollspy
        background="var(--van-gray-2)"
        offset-top="174px"
      >
        <van-tab title="资料">
          <van-cell-group>
            <van-field
              v-for="(item, index) in baseMessageList"
              :key="index"
              :label="item.name"
              center
              readonly
              colon
              clickable
            >
              <template #input>
                <span>
                  {{
                    item.name === '等级'
                      ? workerData[item.id] === 1
                        ? '金牌师傅'
                        : workerData[item.id] === 0
                          ? '银牌师傅'
                          : '铜牌师傅'
                      : workerData[item.id] ?? ''
                  }}
                </span>
              </template>
            </van-field>
          </van-cell-group>
        </van-tab>
        <van-tab title="装修历史">
          <van-cell-group>
            <van-field
              label="装修历史"
              class="tabTitle"
              clickable
              readonly
            >
              <template #right-icon>
                <span class="btnStyle" @click.stop="editClick(4)">
                  新增
                </span>
              </template>
            </van-field>
            <van-swipe-cell
              v-for="(item, index) in historyList.slice(0, 4)"
              :key="index"
            >
              <van-cell class="historyItem">
                <div class="itemBox">
                  <div class="left">
                    <span>{{ index + 1 }}</span>
                  </div>
                  <div class="right">
                    <p class="title">
                      {{ item.o_address }}
                    </p>
                    <div class="message">
                      <span>{{ item.o_date }}</span>
                      <span>{{ item.o_area }}</span>
                      <span>
                        {{
                          item.o_garde === 0
                            ? '铜牌'
                            : item.o_garde === 1
                              ? '金牌'
                              : item.o_garde === 2
                                ? '银牌'
                                : ''
                        }}
                      </span>
                      <span>{{ item.o_price }}元/小时</span>
                    </div>
                  </div>
                </div>
              </van-cell>
              <template #right>
                <van-button square type="danger" text="删除" @click.stop="btnClick('delHistory', item)" />
                <van-button square type="primary" text="编辑" @click.stop="btnClick('ediHistory', item)" />
              </template>
            </van-swipe-cell>
          </van-cell-group>
        </van-tab>
        <van-tab title="参考价格">
          <van-cell-group>
            <van-cell class="tabTitle" title="参考价格" center>
              <template #value>
                <span class="btnStyle" @click.stop="editClick(3)">
                  编辑
                </span>
              </template>
            </van-cell>
            <van-field
              label="历史最低单价"
              colon
              clickable
              label-width="100"
            >
              <template #input>
                <span>{{ priceList.w_historyPrice }} 元/小时</span>
              </template>
            </van-field>
            <van-field
              label="目前施工单价"
              colon
              clickable
              label-width="100"
            >
              <template #input>
                <span>{{ priceList.w_price }} 元/小时</span>
              </template>
            </van-field>
          </van-cell-group>
        </van-tab>
        <van-tab title="完工照片">
          <van-cell-group>
            <van-cell class="tabTitle" title="完工照片" center />
            <van-empty description="暂无数据" />
          </van-cell-group>
        </van-tab>
      </van-tabs>
    </div>
  </div>
  <div v-else class="userContainer">
    <van-empty description="暂无数据" />
  </div>
</template>

<style lang="less" scoped>
.userContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .top {
    width: 100%;
    background-color: var(--van-gray-2);
    display: flex;
    flex-direction: column;
    .userBox {
      padding-top: 10px;
      :deep(.van-card) {
        background-color: var(--van-gray-2);
      }
      .titleBox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title {
          font-size: 15px;
          font-weight: bold;
        }
        .workerType {
          display: flex;
          gap: 5px;
        }
      }
    }
  }

  .bottom {
    flex: 1;
    overflow: auto;
    .btnStyle {
      color: var(--van-primary-color);
    }
    .historyItem {
      .itemBox {
        width: 100%;
        text-align: start;
        display: flex;
        gap: 15px;
        .left {
          display: flex;
          align-items: center;
          justify-content: center;
          span {
            font-size: 18px;
            font-family: fantasy;
          }
        }
        .right {
          flex: 1;
          padding-right: 20px;
          .title {
            color: black;
          }
          .message {
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }
    .tabTitle {
      font-weight: bold;
      background-color: var(--van-gray-2);
    }
    :deep(.van-swipe-cell__right) {
      .van-button {
        height: 100%;
      }
    }
  }
}
</style>
