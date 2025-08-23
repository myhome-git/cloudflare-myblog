import 'vue-router';

declare module 'vue-router' {
  interface RouteRecordRaw {
    display?: boolean; // 添加 display 属性
    title?:string;
  }
}