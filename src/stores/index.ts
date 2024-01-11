import { defineStore } from 'pinia'

export const useStore = defineStore({
  id: 'zhiJiaConfig',
  state: () => ({
    mode: '', // light || dark
    token: '', // token
    account: {}, // 账号信息
  }),
  persist: {
    paths: ['mode'],
    storage: localStorage,
  },
})
