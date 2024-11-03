import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import { IS_SUB_DOMAIN } from '@/configs'
import routes from './routes'

const router = createRouter({
  history: IS_SUB_DOMAIN ? createWebHashHistory() : createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
