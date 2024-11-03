import Home from '@/views/home/index.vue'

import type { RouteRecordRaw } from 'vue-router'

const routes:RouteRecordRaw[]=[
  {
    path:'/',
    redirect:'/home'
  },
  {
    path:'/home',
    component:Home
  }
]

export default routes