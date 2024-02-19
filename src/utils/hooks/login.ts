import { useRouter } from 'vue-router'
import { useStore } from '@/stores'

const router = useRouter()
const store = useStore()

// 退出登录
function outLogin() {
  localStorage.removeItem('u_token')
  localStorage.removeItem('u_account')
  store.token = ''
  store.account = {}
  router.replace({ name: 'loginMain' })
}

export { outLogin }
