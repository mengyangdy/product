import { createApp } from 'vue'

import { startMock } from '@/mock'

import '@/style/index.less'

import { createPinia } from 'pinia'

import { setupDirective } from '@/directive'

import router from './router'
import App from './App.vue'

window.isMoved = false
window.isMuted = true

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
setupDirective(app)
app.mount('#app')

startMock()
