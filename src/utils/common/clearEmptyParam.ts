import _cloneDeep from 'lodash/cloneDeep'

// 移除空字符串，null, undefined
export default function clearEmptyParam(config) {
  config.forEach((item) => {
    if (config[item]) {
      const keys = Object.keys(config[item])
      if (keys.length) {
        keys.forEach((key) => {
          const rawType = toRawType(config[item])
          if (['', undefined, null].includes(config[item][key]) && ['Object'].includes(rawType)) {
            // 移除属性之前，进行深拷贝断开引用，避免影响页面
            config[item] = _cloneDeep(config[item])
            delete config[item][key]
          }
        })
      }
    }
  })
}
