<template>
  <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="onClick" />
</template>
<script lang="ts" setup>
import { h, ref } from 'vue';
import { useRouter } from 'vue-router';
import { MailOutlined, AppstoreOutlined, SettingOutlined, HomeOutlined } from '@ant-design/icons-vue';
import type { MenuProps } from 'ant-design-vue';
const current = ref<string[]>(['app']);
const items = ref<MenuProps['items']>([
  {
    key: 'target-to-app',
    icon: () => h(HomeOutlined),
    label: '转到前台',
    title: '转到前台',
  },
  {
    key: 'out-system',
    icon: () => h(SettingOutlined),
    label: '退出系统',
    title: '退出系统',
  },
]);
const router = useRouter();
const onClick = (info: { key: string; keyPath: string[] }) => {
  // console.log('click', info);
  const key = info.key;
  switch (key) {
    case 'target-to-app':
      router.push('/app');
      break;
    case 'out-system':
      // 退出系统逻辑
      // 清除登录状态
      sessionStorage.removeItem('token');
      sessionStorage.clear();
      // 跳转到登录页面或首页
      router.push('/');
      break;
    default:
      console.log('Unknown menu item selected');
  }
  setTimeout(() => {
    current.value = [];
  }, 300);
}
</script>
<style scoped>
.ant-menu-horizontal {
  border-bottom: 0;
}
</style>
