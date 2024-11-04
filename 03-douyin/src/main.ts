import { createApp } from 'vue'
import App from './App.vue'
import "@/style/index.less"
import router from './router'
import { createPinia } from 'pinia'

window.isMoved = false
window.isMuted = true

const pinia=createPinia()
const app=createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
