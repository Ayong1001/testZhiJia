<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { areaList } from '@vant/area-data'
import moment from 'moment'
import type { DataList } from '@/types/formType'

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
// 选择器配置
// 基础参数配置
const pickers = reactive({
  type: 'default',
  isShow: false,
  showCode: '',
  columns: [],
  chooseType: 'value',
})
// 日期配置选择
const defaultBirthday = [(moment().year() - 30).toString(), '06', '01']
// 通用选择器
function pickerClick(item, type = 'default', chooseType = 'value') {
  pickers.type = type
  pickers.chooseType = chooseType
  pickers.columns = item.dataConfig.dataList
  pickers.showCode = item.code
  pickers.isShow = true
}
function onConfirm(e) {
  formData[pickers.showCode] = e.selectedOptions[0][pickers.chooseType]
  pickers.isShow = false
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
  <div v-if="list.length" class="addContainer">
    <van-form ref="formRef" :model-value="formData" :rules="formRules || {}">
      <van-cell-group inset>
        <div v-for="(item, index) in list" :key="index" class="formItem">
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

          <van-field
            v-if="item.type === 'picker'"
            is-link
            readonly
            :label="item.text"
            :name="item.code"
            :placeholder="`请输入${item.text}`"
            @click="pickerClick(item, undefined, item.dataConfig.chooseType)"
          >
            <template #input>
              <span>{{ item.dataConfig.chooseType === 'text' ? formData[item.code] : item.dataConfig.dataList.find(listItem => {
                return listItem.value === formData[item.code]
              }).text }}</span>
            </template>
          </van-field>
        </div>
      </van-cell-group>
    </van-form>
    <!-- 选择器弹窗 -->
    <van-popup v-model:show="pickers.isShow" position="bottom">
      <div v-if="pickers.isShow === true">
        <van-picker
          v-if="pickers.type === 'default'"
          :columns="pickers.columns"
          @confirm="onConfirm"
          @cancel="pickers.isShow = false"
        />

        <van-date-picker
          v-if="pickers.type === 'date'"
          v-model="defaultBirthday"
          :min-date="new Date((moment().year() - 150), 0, 1)"
          :max-date="new Date()"
          title="选择日期"
          @confirm="onConfirm"
          @cancel="pickers.isShow = false"
        />
        <van-area
          v-if="pickers.type === 'address'"
          title="选择地区"
          :area-list="areaList" @confirm="onConfirm"
          @cancel="pickers.isShow = false"
        />
      </div>
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.addContainer {
  width: 100%;
  height: 100%;
}
</style>
