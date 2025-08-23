// 引入系统文件
import './assets/main.css'
import { createApp } from 'vue'

import Andt from "ant-design-vue"
import "ant-design-vue/dist/reset.css";

import App from './App.vue'
import router from './router/router'

const app = createApp(App)
app.use(Andt)
app.use(router)
app.mount('#app')
