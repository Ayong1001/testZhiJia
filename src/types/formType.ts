interface FormType {
  type: string
  text: string
  dataList: DataList[]
  formRules?: object
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
  disabled?: boolean
  readonly?: boolean
  dataConfig?: {
    type?: string
    dataList?: any[]
    chooseType?: string
  }
}

export type { FormType, DataList }
