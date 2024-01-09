import { defineStore } from 'pinia'

export const useStore = defineStore({
  id: 'index',
  persist: true,
  state: () => ({
    mode: '', // light || dark
    account: {}, // 账号信息
  }),
})
