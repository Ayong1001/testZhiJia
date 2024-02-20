import { useStore } from '@/stores'

const store = useStore()

// 退出登录
function outLogin() {
  localStorage.removeItem('u_token')
  localStorage.removeItem('u_account')
  store.token = ''
  store.account = {}
  window.location.replace('/login/main')
}

export { outLogin }
