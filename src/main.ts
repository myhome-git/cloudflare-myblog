// 引入系统文件
import './assets/main.css'
import { createApp } from 'vue'

import Andt from "ant-design-vue"
import "ant-design-vue/dist/reset.css";

import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/index.ts'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(Andt)
app.use(router)
app.mount('#app')