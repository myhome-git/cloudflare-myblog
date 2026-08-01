<template>
  <div class="app-win">
    <a-layout style="height: 100vh;">
      <Sider v-model:collapsed="collapsed"></Sider>
      <a-layout>
        <a-layout-header>
          <span>
            <menu-unfold-outlined
              v-if="collapsed"
              class="trigger"
              @click="collapsed = !collapsed"
            />
            <menu-fold-outlined v-else class="trigger" @click="collapsed = !collapsed" />
          </span>
          <NavigationMenu></NavigationMenu>
        </a-layout-header>
        <a-layout-content style="margin: 0px;position: relative;">
          <div class="view-container-box" :style="{ padding: '0px' }">
            <div class="view-container" :style="{ minHeight: '360px' }">
              <Tabs></Tabs>
            </div>
          </div>
        </a-layout-content>
        <a-layout-footer style="text-align: center;padding:8px 50px;">
          联系方式：admin@myhome.top
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, nextTick, onUnmounted } from 'vue';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
import Sider from "./layout/sider/Index.vue";
import NavigationMenu from "./layout/navigationMenu/NavigationMenu.vue";
import Tabs from './layout/tabs/Index.vue'
import { useStyle } from '@/hooks/useStyle.ts'
import themeCss from './layout-theme.css?raw'

// 动态注入主题样式，组件销毁时自动移除
useStyle(themeCss, 'admin-layout-theme')

const collapsed = ref(false);

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
.ant-layout,
.ant-menu-light,
.ant-layout .ant-layout-sider-light,
.ant-layout .ant-menu-light,
.ant-layout .ant-layout-header,
.ant-layout .ant-layout-footer{
  background: transparent;
}
.ant-layout-header{
    padding: 0px 14px;
    display: grid; 
    grid-template-columns: 1fr auto; 
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: rgba(var(--appwin--border-color-rgb), var(--appwin--border-color-opacity));
}
.ant-layout .ant-layout-header{
  height: 60px;
  line-height: 60px;
}
.ant-layout .ant-layout-footer{
    position: relative;
}
.ant-layout .ant-layout-footer::before{
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: -1px;
    width: 100%;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: rgba(var(--appwin--border-color-rgb), var(--appwin--border-color-opacity));
}

.view-container-box {
    position: absolute;
    width: 100%;
    height: calc(100% - 1px);
    overflow: hidden;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
    background-color: #fff;
}

.view-container {
    overflow: hidden;
    position: relative;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
}

.trigger {
    font-size: 18px;
    cursor: pointer;
    transition: color 0.3s;
}
.trigger:hover {
    color: #1890ff;
}
</style>