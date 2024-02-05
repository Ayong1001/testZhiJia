<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { areaList } from '@vant/area-data'
import moment from 'moment'
import type { DataList } from '@/types/formType'
import workTypeList from '@/utils/common/workTypeList'
import countryList from '@/utils/common/country'

const props = defineProps({
  list: Array,
  formRules: Object,
})

const formData = reactive({})
const formRef = ref(null)
const list: DataList[] = props.list as unknown as DataList[]
const formRules = props.formRules
// 初始化表单
function initializationFrom() {
  list.forEach((item: any) => {
    formData[item.code] = item.data || null
  })
}
// 当前表单item
const formItem = ref()
function formItemClick(value) {
  formItem.value = value
}
function showChoose(item) {
  return item.dataConfig.dataListText && item.dataConfig.dataList[Number(formData[item.code])]
    ? item.dataConfig.dataList[Number(formData[item.code])][item.dataConfig.dataListText]
    : formData[item.code]
}
// 选择器配置
const pickers = reactive({
  isShow: false,
  showCode: '',
  sexColumns: [{ text: '男', value: 1 }, { text: '女', value: 0 }],
  idTypeColumns: [
    {
      value: 0,
      text: '居民身份证',
    },
    {
      value: 1,
      text: '护照',
    },
    {
      value: 2,
      text: '台胞证',
    },
    {
      value: 3,
      text: '港澳通行证',
    },
    {
      value: 4,
      text: '其它证件',
    },
  ],
  typeWorkColumns: workTypeList,
  countryList: countryList.map((item) => {
    return { value: item.country_id, text: item.country_name_cn }
  }),
})
// 通用选择器
function onConfirm(e) {
  switch (pickers.showCode) {
    case 'w_typeWork':
    case 'w_nationality':
      formData[pickers.showCode] = e.selectedOptions[0].text
      break
    case 'w_birthday':
    case 'w_domicileAddressCity':
    case 'w_habitualResidenceCity':
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
// 日期选择
const defaultBirthday = [(moment().year() - 30).toString(), '06', '01']
const dateChange = function (e) {
  formData[formItem.value.code] = e
}

// 返回数据
function formSubmit() {
  return formData
}

defineExpose({
  formSubmit,
  formRef,
})

onMounted(() => {
  initializationFrom()
})
</script>

<template>
  <div class="addContainer">
    <div v-if="list.length" class="addFormBox">
      <van-form ref="formRef" :model-value="formData" :rules="formRules || {}">
        <div class="formItem">
          <div v-for="(item, index) in list" :key="index">
            <van-field
              v-if="item.type === 'input'" v-model="formData[item.code]"
              :label="item.text"
              :name="item.code"
              :placeholder="`请输入${item.text}`"
              :disabled="item?.disabled"
            />
            <van-checkbox-group
              v-if="item.type === 'checkbox'" v-model="formData[item.code]"
              :label="item.text" :name="item.code" direction="horizontal"
              :disabled="item.disabled"
            >
              <van-checkbox v-for="(checkItem, checkIndex) in item.dataConfig.dataList" :key="checkIndex" name="checkItem">
                {{ checkItem }}
              </van-checkbox>
            </van-checkbox-group>
            <van-form-item
              v-if="item.type === 'datePicker'"
              :label="item.text"
              :name="item.code"
            >
              <uni-datetime-picker
                v-model="formData[item.code]"
                type="date"
                @change="dateChange"
                @click="formItemClick(item)"
              >
                <template #default>
                  <text>{{ formData[item.code] }}</text>
                </template>
              </uni-datetime-picker>
            </van-form-item>
            <van-form-item v-if="item.type === 'picker'" :label="item.text" :name="item.code">
              <picker
                class="pickerStyle"
                :range="item.dataConfig.dataList"
                :range-key="item.dataConfig.dataListText"
                @change="onConfirm"
                @click="formItemClick(item)"
              >
                <div>{{ showChoose(item) }}</div>
              </picker>
            </van-form-item>
            <van-form-item
              v-if="item.type === 'addressPicker'"
              :label="item.text"
              :name="item.code"
            />
          </div>
          <!-- 选择器弹窗 -->
          <van-popup v-model:show="pickers.isShow" position="bottom">
            <van-picker
              v-if="pickers.showCode === 'w_sex'"
              :columns="pickers.sexColumns"
              @confirm="onConfirm"
              @cancel="pickers.isShow = false"
            />
            <van-picker
              v-if="pickers.showCode === 'w_idType'"
              :columns="pickers.idTypeColumns"
              @confirm="onConfirm"
              @cancel="pickers.isShow = false"
            />
            <van-picker
              v-if="pickers.showCode === 'w_typeWork'"
              :columns="pickers.typeWorkColumns"
              @confirm="onConfirm"
              @cancel="pickers.isShow = false"
            />
            <van-picker
              v-if="pickers.showCode === 'w_nationality'"
              :columns="pickers.countryList"
              @confirm="onConfirm"
              @cancel="pickers.isShow = false"
            />
            <van-date-picker
              v-if="pickers.showCode === 'w_birthday'"
              v-model="defaultBirthday"
              :min-date="new Date((moment().year() - 150), 0, 1)"
              :max-date="new Date()"
              title="选择日期"
              @confirm="onConfirm"
              @cancel="pickers.isShow = false"
            />
            <van-area
              v-if="['w_domicileAddressCity', 'w_habitualResidenceCity'].includes(pickers.showCode)" title="选择地区" :area-list="areaList" @confirm="onConfirm"
              @cancel="pickers.isShow = false"
            />
          </van-popup>
        </div>
      </van-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
.addContainer {
  width: 100%;
  height: 100%;
}
</style>
