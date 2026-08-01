<template>
  <a-sub-menu key="theme" :title="`主题-${themeLabel}`">
    <template #icon>
      <BgColorsOutlined />
    </template>
    <a-menu-item
      v-for="item in themeItems"
      :key="`theme-${item.key}`"
      @click="handleSettingChange(item.key)"
    >
      <component :is="item.icon" v-if="item.icon" />
      {{ item.label }}
    </a-menu-item>
  </a-sub-menu>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import {
  BgColorsOutlined,
  HomeOutlined,
  CloudOutlined,
  ThunderboltOutlined
} from '@ant-design/icons-vue';
import PostMessage from '@/utils/postMessage.js'

const { handleSendSystemMessage } = PostMessage()

// 主题 key 到中文的映射
const themeLabels: Record<string, string> = {
  default: '默认',
  green: '护眼绿',
  blue: '海水蓝',
  pink: '胭脂粉',
  Ivory: '象牙白',
  gray: '冷淡灰',
  sepia: '纸张黄',
  dark: '夜间模式',
};

// 主题菜单项
const themeItems = [
  { key: 'default', label: '默认', icon: null },
  { key: 'green', label: '护眼绿', icon: HomeOutlined },
  { key: 'blue', label: '海水蓝', icon: CloudOutlined },
  { key: 'pink', label: '胭脂粉', icon: CloudOutlined },
  { key: 'Ivory', label: '象牙白', icon: CloudOutlined },
  { key: 'gray', label: '冷淡灰', icon: CloudOutlined },
  { key: 'sepia', label: '纸张黄', icon: CloudOutlined },
  { key: 'dark', label: '夜间模式', icon: ThunderboltOutlined },
];

// 主题设置
const theme = ref(localStorage.getItem('theme') || 'default');
const themeLabel = computed(() => themeLabels[theme.value] || theme.value);

// 主题设置变化
const handleSettingChange = (key: string) => {
  theme.value = key;
};

// 监听主题变化
watch(theme, (newValue) => {
  document.body.className = newValue;
  localStorage.setItem('theme', newValue);
  handleSendSystemMessage('themeChange', newValue)
});

onMounted(() => {
  // document.body.className = theme.value;
});
</script>

<style scoped></style>