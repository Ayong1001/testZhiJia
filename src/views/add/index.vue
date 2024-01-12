<script setup lang="ts">
import { reactive, ref } from 'vue'
import { areaList } from '@vant/area-data'
import request from '@/utils/request'
import addImg from '@/assets/imgs/add/addUser.svg'
import workTypeList from '@/utils/common/workTypeList.js'

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
  showCode: 'sex',
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
})

// 通用选择器
function onConfirm(selectedValues) {
  formData.value[pickers.showCode] = selectedValues
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
    <div v-if="!addState" class="addBox" @click="changeAddState">
      <img class="addImg" :src="addImg" alt="">
      <p style="text-align: center;">
        添 加 新 工 人
      </p>
    </div>
    <div v-else class="addBox">
      <div class="addTitle">
        <div class="addTitleLeft" @click="changeAddState">
          <van-icon name="arrow-left" />
          <text>返回</text>
        </div>
        <div class="addTitleCenter">
          <text>工人信息</text>
        </div>
      </div>
      <div class="addFormBox">
        <van-form ref="formRef" :model-value="formData" :rules="formRules">
          <van-cell-group inset>
            <p>用户基础信息</p>
            <van-field
              v-model="formData.w_name"
              name="姓名"
              label="姓名"
              placeholder="姓名"
              :rules="[{ required: true, message: '请填写姓名' }]"
            />
            <van-field
              v-model="formData.w_sex"
              is-link
              readonly
              name="picker"
              label="性别"
              placeholder="点击选择性别"
              @click="pickers.isShow = true"
            />
            <van-field
              v-model="formData.w_phone"
              name="联系电话"
              label="联系电话"
              placeholder="联系电话"
              :rules="[{ required: true, message: '请填写联系电话' }]"
            />
            <van-field
              v-model="formData.w_idType"
              is-link
              readonly
              name="picker"
              label="证件类型"
              placeholder="点击选择证件类型"
              @click="pickers.isShow = true"
            />
            <van-field
              v-model="formData.w_idNumber"
              name="证件号码"
              label="证件号码"
              placeholder="证件号码"
              :rules="[{ required: true, message: '请填写证件号码' }]"
            />
            <van-field
              v-model="formData.w_typeWork"
              is-link
              readonly
              name="工种"
              label="工种"
              placeholder="点击选择工种"
              @click="pickers.isShow = true"
            />
            <van-field
              v-model="formData.w_birthday"
              is-link
              readonly
              name="出生日期"
              label="出生日期"
              placeholder="点击选择出生日期"
              @click="pickers.isShow = true"
            />
            <van-field
              v-model="formData.w_nationality"
              is-link
              readonly
              name="国籍"
              label="国籍"
              placeholder="点击选择国籍"
              @click="pickers.isShow = true"
            />
          </van-cell-group>
          <van-cell-group inset>
            <p>户籍所在地</p>
            <van-field
              v-model="formData.w_domicileAddressCity"
              is-link
              readonly
              name="picker"
              label="所在地区"
              placeholder="点击选择所在地区"
              @click="pickers.isShow = true"
            />
            <van-field
              v-model="formData.w_domicileAddress"
              name="详细地址"
              label="详细地址"
              placeholder="详细地址"
              :rules="[{ required: true, message: '请填写详细地址' }]"
            />
          </van-cell-group>
          <van-cell-group inset>
            <p>经常居住地</p>
            <van-field
              v-model="formData.w_habitualResidenceCity"
              is-link
              readonly
              name="picker"
              label="所在地区"
              placeholder="点击选择所在地区"
              @click="pickers.isShow = true"
            />
            <van-field
              v-model="formData.w_habitualResidence"
              name="详细地址"
              label="详细地址"
              placeholder="详细地址"
              :rules="[{ required: true, message: '请填写详细地址' }]"
            />
          </van-cell-group>
          <van-cell-group inset>
            <p>其它</p>
            <van-field
              v-model="formData.w_wechatNumber"
              name="微信号"
              label="微信号"
              placeholder="微信号"
              :rules="[{ required: true, message: '请填写微信号' }]"
            />
            <van-field
              v-model="formData.w_email"
              name="邮箱"
              label="邮箱"
              placeholder="邮箱"
              :rules="[{ required: true, message: '请填写邮箱' }]"
            />
            <van-field
              v-model="formData.w_emergencyPhone"
              name="紧急联系电话"
              label="紧急联系电话"
              placeholder="紧急联系电话"
              :rules="[{ required: true, message: '请填写紧急联系电话' }]"
            />
          </van-cell-group>
          <van-button class="formSubmit" @click="formSubmit">
            提交
          </van-button>
        </van-form>
      </div>
    </div>
    <!-- 选择器弹窗 -->
    <van-popup v-model:show="pickers.isShow" position="bottom">
      <van-picker
        v-if="pickers.showCode === 'sex'"
        :columns="pickers.sexColumns"
        @confirm="onConfirm"
        @cancel="pickers.isShow = false"
      />
      <van-picker
        v-if="pickers.showCode === 'idType'"
        :columns="pickers.idTypeColumns"
        @confirm="onConfirm"
        @cancel="pickers.isShow = false"
      />
      <van-picker
        v-if="pickers.showCode === 'typeWork'"
        :columns="pickers.typeWorkColumns"
        @confirm="onConfirm"
        @cancel="pickers.isShow = false"
      />
      <van-date-picker
        v-if="pickers.showCode === 'birthday'"
        v-model="formData.w_birthday"
        title="选择日期"
      />
      <van-area v-if="pickers.showCode === 'address'" title="选择地区" :area-list="areaList" />
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.pageBox {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .addBox {
    width: 100%;
    height: 100%;
    .addImg{
    width: 100px;
    height: 100px;
  }
    .addTitle {
      height: 120px;
      padding: 0 20px;
      position: relative;
      font-size: 36px;
      background-color: #fff;
      border-bottom: 2px #dadada solid;
      display: flex;
      align-items: center;

      .addTitleLeft {
        display: flex;
        align-items: center;

        image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          transform: rotate(180deg);
        }
      }

      .addTitleCenter {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .addFormBox {
      .formItem {
        padding: 0 40px;
        margin: 30px 0;
        background-color: #fff;

        .formItemTitle {
          height: 80px;
          margin-bottom: 20px;
          border-bottom: 2px #dadada solid;
          display: flex;
          align-items: center;
          font-size: 28px;
          font-weight: 600;

          image {
            width: 60px;
            height: 60px;
            margin-right: 20px;
            object-fit: cover;
          }
        }
      }

      .radioStyle {
        display: flex;

        ::v-deep .van-label-pointer {
          display: flex;
          align-items: center;
          margin-right: 40px;
        }
      }

      ::v-deep .van-select {
        border: 0;

        .van-select__input-text {
          font-size: 32px;
          color: rgb(0 0 0 / 54%);
        }
      }

      ::v-deep .van-date-x--border {
        border: 0;

        .van-date-x {
          padding: 0;
        }

        .van-date__x-van-field {
          padding: 0;
          font-size: 32px;
        }

        .uniui-calendar::before {
          content: '';
        }
      }

      ::v-deep .van-forms-item {
        padding-bottom: 10px;
        margin-bottom: 10px;
        border-bottom: 2px #dadada solid;

        .van-forms-item__content {
          display: flex;
          align-items: center;
        }

        .van-forms-item__label {
          width: 220px !important;
        }
      }
    }
  }
}
</style>
