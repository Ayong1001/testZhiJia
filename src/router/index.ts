// https://router.vuejs.org/zh/
import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: true, parent: '#app' })

// 定义路由，每个路由都需要映射到一个组件
const routes = [
  {
    path: '/:catchA11(.*)',
    name: '404',
    component: () => import('@/views/common/404.vue'),
    children: [],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    redirect: () => 'login/main',
    children: [
      {
        path: 'main',
        name: 'loginMain',
        component: () => import('@/views/login/main/index.vue'),
      },
      {
        path: 'register',
        name: 'loginRegister',
        component: () => import('@/views/login/register/index.vue'),
      },
    ],
  },
  {
    path: '/',
    name: 'main',
    component: () => import('@/views/index.vue'),
    redirect: () => 'home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
      },
      {
        path: 'add',
        name: 'add',
        component: () => import('@/views/add/index.vue'),
      },
      {
        path: 'service',
        name: 'service',
        component: () => import('@/views/service/index.vue'),
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/user/index.vue'),
      },
    ],
  },
]

// 创建路由实例并传递 `routes` 配置
const router = createRouter({
  // eslint-disable-next-line node/prefer-global/process
  history: createWebHistory(process.env.VUE_APP_PUBLIC_PATH),
  routes,
})

router.beforeEach((_to, _from, next) => {
  NProgress.start() // start progress bar
  next()
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

// 导出路由实例，并在 `main.ts` 挂载
export default router
