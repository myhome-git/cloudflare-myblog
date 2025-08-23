import { defineAsyncComponent } from 'vue';
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
const components = import.meta.glob('../views/**/*.vue');

// Object.keys(components).forEach((key) => {
//   console.log(key);
// });

import { confRouterIntex } from "./index";
const newResultRouter = updateRouterRource(confRouterIntex, "");
// createWebHistory,createWebHashHistory
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: newResultRouter,
})

function updateRouterRource(list: any, parentPath: string = '') {
  list.forEach((element: { source: any; component: () => Promise<any>; children: any[]; path: any; }) => {
    try {
      // 补全路由路径
      if (parentPath) {
        if (!element.path.startsWith('/')) {
          element.path = `/${element.path}`;
        }
        element.path = `${parentPath}${element.path}`;
        element.path = `${element.path}`.replace(/\/+$/, "");
      }

      /**
       * 修正错误
       * 如果出现两个一样的name名，那么就会报错，我们先用其它字段代替
       */
      // @ts-ignore
      element.__name = element.name;
      // @ts-ignore
      delete element.name;
      // console.log(`路由路径：`, element.path);
      // console.log(`路由是否存在source`, element.source !== undefined);
      if (element.source) {
        const componentPath = `../views${element.source}`;
        // console.log(`路由组件地址：`, componentPath);
        // element.component = defineAsyncComponent(() => import(/* @vite-ignore */ `${componentPath}`)); //dev模式下可用
        // element.component = () => import(/* @vite-ignore */ componentPath);
        const tempComponent = components[componentPath];
        if (tempComponent) {
          element.component = tempComponent;
        } else {
          console.error(`未找到组件`, componentPath);
        }
        // element.component = components[componentPath];
      }
      if (element.children) {
        updateRouterRource(element.children, element.path);
      }
    } catch (e) {
      debugger
    }
  });
  return list;
}

export default router
