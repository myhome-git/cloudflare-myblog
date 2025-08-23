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
                <div>
                    <PageHeader />
                </div>
                <div class="view-container-box" :style="{ padding: '24px' }">
                    <div class="view-container" :style="{ minHeight: '360px' }">
                        <RouterView></RouterView>
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
import { RouterLink, RouterView, useRouter } from 'vue-router'
import Sider from "./layout/sider/Sider.vue";
import PageHeader from "./layout/pageHeader/PageHeader.vue";
import NavigationMenu from "./layout/navigationMenu/NavigationMenu.vue";

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
    height: calc(100% - 40px);
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
