// 引入系统文件
import './assets/main.css'
import { createApp } from 'vue'

import Andt from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

// 状态管理
import { createPinia } from 'pinia'

// 路由
import router from './router/index'

// 注册组件
import setupComponents from '@/components'

// 入口组件
import App from './App.vue'
const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(Andt)
app.use(router)
setupComponents(app)
app.mount('#app')
