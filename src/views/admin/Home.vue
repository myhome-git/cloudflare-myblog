<template>
    <a-layout style="min-height: 100vh">
        <Sider></Sider>
        <a-layout>
            <a-layout-header
                style="background: #fff; padding: 0px 14px;display: grid; grid-template-columns: 1fr auto; align-items: center;">
                <span></span>
                <NavigationMenu></NavigationMenu>
            </a-layout-header>
            <a-layout-content style="margin: 0px;position: relative;">
                <div class="view-container-box" :style="{ padding: '0px' }">
                    <div class="view-container" :style="{ minHeight: '360px' }">
                        <Tabs></Tabs>
                    </div>
                </div>
            </a-layout-content>
            <a-layout-footer style="text-align: center">
                Ant Design ©2018 Created by Ant UED
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>
<script lang="ts" setup>
import { onMounted, nextTick, onUnmounted } from 'vue';
import Sider from "./layout/sider/Sider.vue";
import NavigationMenu from "./layout/navigationMenu/NavigationMenu.vue";
import Tabs from './layout/tabs/Index.vue'

// 挂载事件
onMounted(async () => {
    // 使用 $nextTick 确保 DOM 已经渲染完成
    await nextTick(() => {
        
    });
});

onUnmounted(() => {
    
});
</script>
<style scoped>
.site-layout .site-layout-background {
    background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
    background: #141414;
}

.view-container-box {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
}

.view-container {
    background: #fff;
    overflow: auto;
    position: relative;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
}
</style>
