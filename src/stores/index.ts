import { defineStore } from 'pinia'

export const useStore = defineStore({
  id: 'config',
  state: () => ({
    mode: '', // light || dark
    token: '', // token
    account: {}, // 账号信息
  }),
  persist: {
    paths: ['mode', 'account'],
    storage: localStorage,
  },
})
