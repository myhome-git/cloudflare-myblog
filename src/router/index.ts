import { createRouter, createWebHistory } from 'vue-router';
import updateRouterRource from './updateRouterRource'
import { indexConf } from './index.config'

const newResultRouter = updateRouterRource(indexConf, "");
// createWebHistory,createWebHashHistory
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: newResultRouter,
})

export default router