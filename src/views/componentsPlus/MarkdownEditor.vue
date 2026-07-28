<template>
  <div class="markdown-container" :style="{ height: props.height ? props.height.toString() : '100%' }" @keydown="onKeydown">
    <MdEditor v-if="props.type !== 'view'"
      v-model="markdownValue"
      :editorId="uuid"
      :theme="theme"
      :previewTheme="previewTheme"
      :language="language"
      :style="{ height: '100%' }"
      :onChange="onChange"
    />
    <MdPreview v-else
      :modelValue="markdownValue"
      :editorId="uuid"
      :theme="theme"
      :previewTheme="previewTheme"
      :language="language"
      :style="{ height: '100%' }"
      :onChange="onChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { MdEditor, MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { createUUID } from "@/utils/utils";

const props = defineProps({
  type: {
    type: String,
    default: 'edit&preview'
  },
  value: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: '100%'
  }
})
const markdownValue = ref(props.value);
watch(() => props.value, (newValue) => {
  markdownValue.value = newValue;
})

const uuid = `markdown-${createUUID()}`;

const theme = ref('light' as const);
const previewTheme = ref('default' as const);
const language = ref('zh-CN');

const onChange = (value: string) => {
  markdownValue.value = value;
}

// 阻止 Esc 键冒泡，防止触发全局关闭事件
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    e.stopPropagation();
  }
}

// 设置内容
const setValue = (value: string) => {
  markdownValue.value = value;
}
const getValue = (): string => {
  return markdownValue.value || '';
}
const clearValue = () => {
  markdownValue.value = '';
}
const getHtml = () => {
  return '';
}
const getPreviewer = () => {
  return null;
}
const exportToFile = (type: string) => {
  // md-editor-v3 无内置导出功能
}

// 暴露给父组件的方法
defineExpose({ setValue, getValue, clearValue, getHtml, getPreviewer, exportToFile });
</script>
<style scoped>
.markdown-container {
    position: relative;
}
</style>
