<template>
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
        <div class="logo">logo</div>
        <template v-if="routerList">
            <a-menu v-model:selectedKeys="selectedKeys" mode="inline" theme="dark"
             @deselect="eventTest2"
             @openChange="eventTest3"
             @select="eventTest4">
                <SiderMenu :list="<any>routerList"></SiderMenu>
            </a-menu>
        </template>
    </a-layout-sider>
</template>
<script lang="ts" setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref } from 'vue';
const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['/home']);

// 获取路由对象
const router = useRouter();
const routerList = router?.options?.routes;
import SiderMenu from "./SiderMenu.vue";

function eventTest1(event: any) {
    console.log("click ...",event);
}

function eventTest2(event: any) {
    console.log("deselect ...",event);
}

function eventTest3(event: any) {
    // console.log("openChange ...",event);
}

function eventTest4(event: any) {
    // console.log("select ...",event);
}

</script>
<style scoped>
#components-layout-demo-side .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
    background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
    background: #141414;
}
a { /* 或者更具体的选择器，例如 router-link-active */
  text-decoration: none; /* 移除下划线 */
  color: inherit;       /* 继承父元素的颜色 */
  /* 其他样式重置 */
}
a:hover { /* 或者更具体的选择器，例如 router-link-active */
  color: inherit;       /* 继承父元素的颜色 */
  transition:none;
}
</style>
