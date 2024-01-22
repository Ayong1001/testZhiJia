<script setup lang="ts">
import { reactive, ref } from 'vue'
import { areaList } from '@vant/area-data'
import request from '@/utils/request'
import addImg from '@/assets/images/add/addUser.svg'
import workTypeList from '@/utils/common/workTypeList'
import countryList from '@/utils/common/country'

const addState = ref(false)
const formRef = ref(null)
const baseFormData = {
  w_name: '', // 姓名
  w_domicileAddress: '', // 户籍详细地址
  w_phone: '', // 联系电话
  w_idType: '', // 证件类型
  w_idNumber: '', // 证件号码
  w_typeWork: workTypeList[0].text, // 工种
  w_birthday: '', // 生日
  w_sex: null, // 性别
  w_nationality: '中国', // 国籍
  w_domicileAddressCity: '', // 户籍所在地
  w_habitualResidenceCity: '', // 经常居住地
  w_habitualResidence: '', // 经常详细地址
  w_emergencyContact: '', // 紧急联系人
  w_addressCity: '', // 现在所在地
  w_address: '', // 现在详细地址
  w_nation: '', // 民族
  w_wechatNumber: '', // 微信号
  w_email: '', // 邮箱
  w_emergencyPhone: '', // 紧急联系电话
}
// form表单数据
const formData = ref(JSON.parse(JSON.stringify(baseFormData)))

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
      formData.value[pickers.showCode] = e.selectedOptions[0].text
      break
    case 'w_birthday':
    case 'w_domicileAddressCity':
    case 'w_habitualResidenceCity':
      formData.value[pickers.showCode] = e.selectedOptions.map((item: any) => {
        return item.text
      }).join('-')
      break
    default:
      formData.value[pickers.showCode] = e.selectedOptions[0].value
      break
  }
  pickers.isShow = false
}
const formRules = {
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
}
// 添加页面切换
function changeAddState() {
  formData.value = JSON.parse(JSON.stringify(baseFormData))
  addState.value = !addState.value
}
// 表单提交/校验
function formSubmit() {
  formRef.value
    .validate()
    .then(() => {
      request.post('/worker/add', { data: formData.value }).then((res: any) => {
        if (res.statusCode === 200) {
          // messageToggle('success', '提交成功!')
          setTimeout(() => {
            changeAddState()
          }, 1000)
        }
        else {
          // messageToggle('error', '提交失败!')
        }
      })
    })
    .catch(() => {
      // messageToggle('error', err[0].errorMessage)
    })
}
</script>

<template>
  <div class="pageBox">
    <div v-if="!addState" class="btnBox" @click="changeAddState">
      <img class="addImg" :src="addImg" alt="">
      <p style="text-align: center;">
        添 加 新 工 人
      </p>
    </div>
    <div v-else class="addBox">
      <van-nav-bar
        title="工人信息"
        left-text="返回"
        left-arrow
        @click-left="changeAddState"
      />
      <div class="addFormBox">
        <van-form ref="formRef" :model-value="formData" :rules="formRules">
          <van-cell-group inset class="formBox">
            <van-field class="title">
              <template #input>
                <span>
                  用户基础信息
                </span>
              </template>
            </van-field>
            <van-field
              v-model="formData.w_name"
              name="w_name"
              label="姓名"
              placeholder="姓名"
              :rules="[{ required: true, message: '请填写姓名' }]"
            />
            <van-field
              v-model.number="formData.w_sex"
              is-link
              readonly
              name="w_sex"
              label="性别"
              placeholder="点击选择性别"
              @click="pickers.showCode = 'w_sex';pickers.isShow = true"
            >
              <template #input>
                <span>{{ pickers.sexColumns.find(e => e.value === formData.w_sex)?.text ?? '' }}</span>
              </template>
            </van-field>
            <van-field
              v-model="formData.w_phone"
              name="w_phone"
              label="联系电话"
              placeholder="联系电话"
              :rules="[{ required: true, message: '请填写联系电话' }]"
            />
            <van-field
              v-model.number="formData.w_idType"
              is-link
              readonly
              name="w_idType"
              label="证件类型"
              placeholder="点击选择证件类型"
              @click="pickers.showCode = 'w_idType';pickers.isShow = true"
            >
              <template #input>
                <span>{{ pickers.idTypeColumns.find(e => e.value === formData.w_idType)?.text ?? '' }}</span>
              </template>
            </van-field>
            <van-field
              v-model="formData.w_idNumber"
              name="w_idNumber"
              label="证件号码"
              placeholder="证件号码"
              :rules="[{ required: true, message: '请填写证件号码' }]"
            />
            <van-field
              v-model="formData.w_typeWork"
              is-link
              readonly
              name="w_typeWork"
              label="工种"
              placeholder="点击选择工种"
              @click="pickers.showCode = 'w_typeWork';pickers.isShow = true"
            />
            <van-field
              v-model="formData.w_birthday"
              is-link
              readonly
              name="w_birthday"
              label="出生日期"
              placeholder="点击选择出生日期"
              @click="pickers.showCode = 'w_birthday';pickers.isShow = true"
            />
            <van-field
              v-model="formData.w_nationality"
              is-link
              readonly
              name="w_nationality"
              label="国籍"
              placeholder="点击选择国籍"
              @click="pickers.showCode = 'w_nationality';pickers.isShow = true"
            />
          </van-cell-group>
          <van-cell-group inset class="formBox">
            <van-field class="title">
              <template #input>
                <span>
                  户籍所在地
                </span>
              </template>
            </van-field>
            <van-field
              v-model="formData.w_domicileAddressCity"
              is-link
              readonly
              name="w_domicileAddressCity"
              label="所在地区"
              placeholder="点击选择所在地区"
              @click="pickers.showCode = 'w_domicileAddressCity';pickers.isShow = true"
            />
            <van-field
              v-model="formData.w_domicileAddress"
              name="w_domicileAddress"
              label="详细地址"
              placeholder="详细地址"
              :rules="[{ required: true, message: '请填写详细地址' }]"
            />
          </van-cell-group>
          <van-cell-group inset class="formBox">
            <van-field class="title">
              <template #input>
                <span>
                  经常居住地
                </span>
              </template>
            </van-field>
            <van-field
              v-model="formData.w_habitualResidenceCity"
              is-link
              readonly
              name="w_habitualResidenceCity"
              label="所在地区"
              placeholder="点击选择所在地区"
              @click="pickers.showCode = 'w_habitualResidenceCity';pickers.isShow = true"
            />
            <van-field
              v-model="formData.w_habitualResidence"
              name="w_habitualResidence"
              label="详细地址"
              placeholder="详细地址"
              :rules="[{ required: true, message: '请填写详细地址' }]"
            />
          </van-cell-group>
          <van-cell-group inset class="formBox">
            <van-field class="title">
              <template #input>
                <span>
                  其它
                </span>
              </template>
            </van-field>
            <van-field
              v-model="formData.w_wechatNumber"
              name="w_wechatNumber"
              label="微信号"
              placeholder="微信号"
              :rules="[{ required: true, message: '请填写微信号' }]"
            />
            <van-field
              v-model="formData.w_email"
              name="w_email"
              label="邮箱"
              placeholder="邮箱"
              :rules="[{ required: true, message: '请填写邮箱' }]"
            />
            <van-field
              v-model="formData.w_emergencyPhone"
              name="w_emergencyPhone"
              label="紧急联系电话"
              placeholder="紧急联系电话"
              :rules="[{ required: true, message: '请填写紧急联系电话' }]"
            />
          </van-cell-group>
          <van-button class="formSubmit" @click="formSubmit">
            提 交
          </van-button>
        </van-form>
      </div>
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
        :min-date="new Date(1900, 0, 1)"
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
</template>

<style lang="less" scoped>
.pageBox {
  width: 100%;
  height: 100%;
  position: relative;
  .btnBox {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .addImg {
      width: 100px;
      object-fit: cover;
      margin-bottom: 10px;
    }
  }
  .addBox {
    .addFormBox {
      margin-top: 10px;
      .title {
        :deep(.van-field__control) {
          display: block;
          text-align: center;
          font-weight: bold;
        }
      }
      .formBox {
        margin-bottom: 15px;
      }
      .formSubmit {
        width: 100px;
        margin-bottom: 20px;
        left: 50%;
        transform: translate(-50%, 0);
      }
    }
  }
}
</style>
