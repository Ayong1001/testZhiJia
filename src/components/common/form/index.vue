<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { areaList } from '@vant/area-data'
import moment from 'moment'
import workTypeList from '@/utils/common/workTypeList'
import countryList from '@/utils/common/country'
import type { DataList } from '@/types/formType'

const props = defineProps({
  list: Array,
})

const formData = reactive({})
const formRef = ref(null)
const list: DataList[] = props.list as unknown as DataList[]
// 初始化表单
function initializationFrom() {
  list.forEach((item: any) => {
    formData[item.code] = item.data ?? null
    if (item.rules) {
      item.rules.forEach((ruleItem: any) => {
        if (ruleItem.pattern)
          ruleItem.pattern = new RegExp(ruleItem.pattern)
      })
    }
  })
}
// 选择器配置
// 选择器基础参数配置
const pickers = reactive({
  type: 'picker',
  isShow: false,
  showCode: '',
  columns: [],
  chooseType: 'text',
})
// 基本选项参数
const defaultColumns = {
  picker_typeWork: workTypeList,
  picker_country: countryList.map((item) => {
    return { value: item.country_id, text: item.country_name_cn }
  }),
  picker_sex: [{ text: '男', value: 1 }, { text: '女', value: 0 }],
}
const pickerModel = computed(() => {
  return [pickers.chooseType === 'value'
    ? formData[pickers.showCode]
    : pickers.columns.length
      ? pickers.columns.find((item) => {
        return item.text === formData[pickers.showCode]
      })?.value
      : defaultColumns[pickers.type]?.find((item) => {
        return item.text === formData[pickers.showCode]
      })?.value]
})
// 日期配置选择
const defaultBirthday = [(moment().year() - 30).toString(), '06', '01']
// 默认选择器
function pickerClick(item) {
  pickers.columns = item?.dataConfig?.dataList ?? []
  pickers.chooseType = item?.dataConfig?.chooseType ?? 'text'
  pickers.type = item.type
  pickers.showCode = item.code
  pickers.isShow = true
}
function onConfirm(e) {
  switch (pickers.type) {
    case 'picker_date':
    case 'picker_address':
      formData[pickers.showCode] = e.selectedOptions.map((item: any) => {
        return item[pickers.chooseType]
      }).join('-')
      break
    default:
      formData[pickers.showCode] = e.selectedOptions[0][pickers.chooseType]
      break
  }
  pickers.isShow = false
}

defineExpose({
  formData,
  formRef,
})

onMounted(() => {
  initializationFrom()
})
</script>

<template>
  <div v-if="list.length" class="container">
    <van-form ref="formRef" :model-value="formData">
      <van-cell-group inset>
        <div v-for="(item, index) in list" :key="index" class="formItem">
          <van-field
            v-if="item.type === 'input'" v-model="formData[item.code]"
            colon
            label-width="90"
            :label="item.text"
            :name="item.code"
            :placeholder="`请输入${item.text}`"
            :required="item.required"
            :rules="item.rules"
            :readonly="item?.disabled"
          />
          <van-field
            v-if="item.type.includes('picker')"
            v-model="formData[item.code]"
            is-link
            readonly
            colon
            label-width="90"
            :label="item.text"
            :name="item.code"
            :required="item.required"
            :rules="item.rules"
            @click="pickerClick(item)"
          >
            <template #input>
              <span v-if="formData[item.code] !== null">{{ item?.dataConfig?.chooseType === 'value' ? item?.dataConfig?.dataList ? item.dataConfig.dataList.find((listItem: any) => {
                return listItem.value.toString() === formData[item.code]
              })?.text : defaultColumns.picker_sex?.find((columnsItem: any) => {
                return columnsItem.value.toString() === formData[item.code]
              })?.text : formData[item.code] }}</span>
              <span v-else style="color: var(--van-text-color-3);">{{ `请输入${item.text}` }}</span>
            </template>
          </van-field>
        </div>
      </van-cell-group>
    </van-form>
    <!-- 选择器弹窗 -->
    <van-popup v-model:show="pickers.isShow" position="bottom">
      <van-date-picker
        v-if="pickers.type === 'picker_date'"
        v-model="defaultBirthday"
        :min-date="new Date((moment().year() - 150), 0, 1)"
        :max-date="new Date()"
        title="选择日期"
        @confirm="onConfirm"
        @cancel="pickers.isShow = false"
      />
      <van-area
        v-else-if="pickers.type === 'picker_address'"
        title="选择地区"
        :area-list="areaList" @confirm="onConfirm"
        @cancel="pickers.isShow = false"
      />
      <van-picker
        v-else
        v-model="pickerModel"
        :columns="pickers.columns.length ? pickers.columns : defaultColumns[pickers.type]"
        @confirm="onConfirm"
        @cancel="pickers.isShow = false"
      />
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
