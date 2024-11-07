import { createApp } from 'vue'

import { startMock } from '@/mock'

import '@/style/index.less'

import { createPinia } from 'pinia'
import VueLazyload from '@jambonn/vue-lazyload'

import { setupDirective } from '@/directive'

import router from './router'
import App from './App.vue'

window.isMoved = false
window.isMuted = true

const pinia = createPinia()
const app = createApp(App)

const loadImage = new URL('./assets/img/icon/img-loading.png', import.meta.url)
  .href
app.use(VueLazyload, {
  preLoad: 1.3,
  loading: loadImage,
  attempt: 1
})
app.use(pinia)
app.use(router)
setupDirective(app)
app.mount('#app')

startMock()
