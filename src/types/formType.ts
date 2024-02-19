import type { FieldRule } from 'vant'

interface FormType {
  type: string
  text: string
  dataList: DataList[]
  request: {
    url: string
    methods: string
  }
}

interface DataList {
  type: string
  text: string
  code: string
  data: any
  required?: boolean
  rules?: FieldRule[]
  disabled?: boolean
  readonly?: boolean
  dataConfig?: {
    type?: string
    dataList?: any[]
    chooseType?: string
  }
}

export type { FormType, DataList }
