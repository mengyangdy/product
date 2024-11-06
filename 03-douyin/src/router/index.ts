import {
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'

import { IS_SUB_DOMAIN } from '@/configs'

import routes from './routes'

const router = createRouter({
  history: IS_SUB_DOMAIN ? createWebHashHistory() : createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

export default router
