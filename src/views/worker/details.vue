<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import workTypeList from '@/utils/common/workTypeList'
import request from '@/utils/request'
import Screenshot1 from '@/assets/images/worker/Screenshot1.png'

const route = useRoute()
const router = useRouter()

const workerData = ref({})
const historyList = ref([])
const priceList = ref({})
let nowDelData = {}
const alertDialog = ref(null)
const alertConfig = ref({
  msgType: '',
  cancelText: '',
  confirmText: '',
  title: '',
  content: '',
})
// 请求基本信息数据
function getWorker() {
  request.get('/worker/id', { params: {
    w_id: route.query.w_id,
  } }).then((res) => {
    if (res.success === true)
      workerData.value = res.data
  })
}
function getHistoryorder() {
  // 请求装修历史数据
  request.get('/worker/historyorder', { params: {
    w_id: route.query.w_id,
  } }).then((res) => {
    if (res.success === true)
      historyList.value = res.data
  })
}
function getPrices() {
  // 请求参考价格数据
  request.get('/worker/prices', { params: {
    w_id: route.query.w_id,
  } }).then((res) => {
    if (res.success === true)
      priceList.value = res.data
  })
}

const dataList = [
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
    name: '完工件数',
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
const contactList = [
  {
    id: '9',
    name: '地点',
  },
  {
    id: '10',
    name: '客户姓名',
  },
  {
    id: '11',
    name: '联系方式',
  },
]
const popupRef = ref(null)
const popupList = {
  msgType: '',
  messageText: '',
}
// 消息提示
function messageToggle(type, span) {
  popupList.msgType = type
  popupList.messageText = span
  popupRef.value.open()
}
// 联系师傅
const inputDialog = ref(null)
function dialogToggle(type) {
  if (type === '联系师傅') {
    inputDialog.value.open()
  }
  else if (type === '删除装修历史') {
    alertConfig.value = {
      msgType: 'error',
      title: '警告',
      content: '是否确定删除此记录？',
      cancelText: '取消',
      confirmText: '确定',
    }
    alertDialog.value.open()
  }
}

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
function btnClick(data) {
  if (data.index === 0) {
    editClick(4, data.name)
  }
  else if (data.index === 1) {
    nowDelData = data
    dialogToggle('删除装修历史')
  }
}
// 执行删除
function delConfirm() {
  request({
    url: `/order/delete?o_id=${nowDelData.name.o_id}`,
    method: 'DELETE',
  }).then((res) => {
    if (res.statusCode === 200) {
      messageToggle('success', '删除成功!')
      setTimeout(() => {
        refreshData()
      }, 500)
    }
    else {
      messageToggle('error', '删除失败!')
    }
  })
}
// 页面数据刷新
function refreshData() {
  getWorker()
  getHistoryorder()
  getPrices()
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
        <van-card
          num="2"
          price="2.00"
          desc="描述信息"
          title="商品标题"
          :thumb="Screenshot1"
        >
          <template #tags>
            <van-tag plain type="primary">
              标签
            </van-tag>
            <van-tag plain type="primary">
              标签
            </van-tag>
          </template>
          <template #footer>
            <van-button size="mini">
              编辑
            </van-button>
          </template>
        </van-card>
      </div>
    </div>
    <div class="bottom">
      <div class="tabBox">
        <Tabs
          v-model:active="active"
          class="tabs"
          scrollspy
          sticky
          offset-top="14.35rem"
        >
          <Tab title="资料" class="tab tab1">
            <CellGroup>
              <Field
                v-for="(item, index) in dataList"
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
                        : workerData[item.id]
                    }}
                  </span>
                </template>
              </Field>
            </CellGroup>
          </Tab>
          <Tab title="装修历史" class="tab tab2">
            <CellGroup>
              <Cell class="title1" title="装修历史" center>
                <template #value>
                  <span class="editBtn2" @click.stop="editClick(4)">
                    新增
                  </span>
                </template>
              </Cell>
              <u-swipe-action
                v-for="(item, index) in historyList.slice(0, 4)"
                :key="index"
              >
                <u-swipe-action-item
                  :key="item"
                  :name="item"
                  :options="[
                    {
                      span: '编辑',
                      style: {
                        backgroundColor: '#3c9cff',
                      },
                    },
                    {
                      span: '删除',
                      style: {
                        backgroundColor: '#f56c6c',
                      },
                    },
                  ]"
                  @click="btnClick"
                >
                  <div class="swipe-action u-border-top">
                    <Cell>
                      <div class="address">
                        <img
                          :src="`/static/c${index + 1}.png`"
                          mode="scaleToFill"
                        >
                        <span>{{ item.o_address }}</span>
                      </div>
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
                        <span>{{ item.o_price }}</span>
                      </div>
                    </Cell>
                  </div>
                </u-swipe-action-item>
              </u-swipe-action>
            </CellGroup>
          </Tab>
          <Tab title="参考价格" class="tab tab1">
            <CellGroup>
              <Cell class="title1" title="参考价格" center>
                <template #value>
                  <span class="editBtn2" @click.stop="editClick(3)">
                    编辑
                  </span>
                </template>
              </Cell>
              <Field
                v-model="priceList.w_historyPrice"
                label="历史最低单价"
                center
                readonly
                colon
                clickable
              />
              <Field
                v-model="priceList.w_price"
                label="目前施工单价"
                center
                readonly
                colon
                clickable
              />
            </CellGroup>
          </Tab>
          <Tab title="完工照片" class="tab">
            <CellGroup>
              <Cell class="title1" title="完工照片" center />
              <Cell>
                <div class="imgBox" />
              </Cell>
            </CellGroup>
          </Tab>
          <!-- <tab title="联系" class="tab tab1">
            <CellGroup>
              <Cell class="title1" title="联系师傅" center></Cell>
              <Field
                v-for="(item, index) in contactList"
                v-model="workerData[item.id]"
                :label="item.name"
                center
                readonly
                colon
                clickable
                :key="index"
              >
              </Field>
            </CellGroup>
          </tab> -->
          <button class="btn" @click="dialogToggle('联系师傅')">
            联系师傅
          </button>
          <uni-popup ref="inputDialog" type="dialog">
            <uni-popup-dialog
              mode="input"
              title="联系师傅"
              placeholder="请输入内容"
              @confirm="dialogInputConfirm"
            >
              <CellGroup>
                <Field
                  v-for="(item, index) in contactList"
                  :key="index"
                  v-model="workerData[item.id]"
                  :label="item.name"
                  center
                  readonly
                  colon
                  clickable
                />
              </CellGroup>
            </uni-popup-dialog>
          </uni-popup>
          <uni-popup ref="alertDialog" type="dialog">
            <uni-popup-dialog
              :type="alertConfig.msgType"
              :cancel-span="alertConfig.cancelText"
              :confirm-span="alertConfig.confirmText"
              :title="alertConfig.title"
              :content="alertConfig.content"
              @confirm="delConfirm"
            />
          </uni-popup>
          <uni-popup ref="popupRef" type="message">
            <uni-popup-message
              :type="popupList.msgType"
              :message="popupList.messageText"
              :duration="2000"
            />
          </uni-popup>
          <div style="height: 1px" />
        </Tabs>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.userContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .top {
    width: 100%;
    height: 400px;
    background-color: #00abff99;
    display: flex;
    flex-direction: column;
    .userBox {
      padding-top: 10px;
      :deep(.van-card) {
        background-color: #fff;
      }
    }
  }

  .bottom {
    flex: 1;
    overflow: auto;

    .tabBox {
      width: 100%;
      height: 100%;

      .tabs {
        box-sizing: border-box;
        .title1 {
          font-size: 34px;
          font-weight: bold;
          height: 100px;
          .editBtn2 {
            font-size: 30px;
            letter-spacing: 3px;
          }
        }

        .tab {
          border-bottom: 30px #f5f5f5 solid;

          .imgBox {
            width: 100%;
            overflow-x: scroll;
            display: flex;
            flex-wrap: nowrap;
            align-items: center;

            img {
              flex-shrink: 0;
              margin: 0 20px;
              max-height: 300px;
            }
          }
          .u-page {
            padding: 0;
          }

          .u-demo-block__title {
            padding: 10px 0 2px 15px;
          }

          .swipe-action {
            &__content {
              padding: 25px 0;

              &__text {
                font-size: 15px;
                padding-left: 30px;
              }
            }
          }
        }

        .tab1 {
          :deep(.van-field__label) {
            font-size: 32px;
            color: #999a9c;
          }

          :deep(.van-field__control) {
            font-size: 30px;
          }
        }

        .tab2 {
          .address {
            display: flex;
            align-items: center;

            img {
              width: 35px;
              height: 35px;
              object-fit: cover;
              margin-right: 10px;
            }

            span {
              font-size: 32px;
              color: #323233;
            }
          }

          .message {
            box-sizing: border-box;
            width: 100%;
            padding: 0 50px;
            display: flex;
            justify-content: space-between;

            span {
              font-size: 28px;
            }
          }
        }
        .btn {
          width: 100%;
          height: 100px;
          margin: 40px auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }

  :deep(.van-field__label) {
    width: auto;
    min-width: var(--van-field-label-width);
    max-width: 50%;
  }
}
</style>
