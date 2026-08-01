<template>
    <div class="markdown-container" :style="{ height: props.height ? props.height.toString() : '100%' }" @keydown="onKeydown">
        <MdEditor
            v-if="props.type !== 'view'"
            v-model="markdownValue"
            :editor-id="uuid"
            :theme="theme"
            :preview-theme="previewTheme"
            :language="language"
            :style="{ height: '100%' }"
            :on-change="onChange"
        />
        <template v-else>
            <div class="markdown-preview-layout">
                <div class="markdown-preview-content">
                    <MdPreview
                        :model-value="markdownValue"
                        :editor-id="uuid"
                        :theme="theme"
                        :preview-theme="previewTheme"
                        :language="language"
                        :on-change="onChange"
                    />
                </div>
                <template v-if="props.catalog">
                    <div class="markdown-preview-catalog">
                        <MdCatalog
                            :editor-id="uuid"
                            :theme="theme"
                            :catalog-max-depth="3"
                            :scroll-element="props.scrollElement"
                        />
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { MdEditor, MdPreview, MdCatalog } from 'md-editor-v3'
// @ts-ignore
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
    },
    catalog: {
        type: Boolean,
        default: false
    },
    scrollElement: {
        type: String,
        default: '.markdown-preview-layout'
    }
})
const markdownValue = ref(props.value);
watch(() => props.value, (newValue) => {
    markdownValue.value = newValue;
})

const uuid = `markdown-${createUUID()}`;

const theme = ref('light' as const);
const previewTheme = ref('github' as const);
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
const exportToFile = () => {
    // md-editor-v3 无内置导出功能
}

// 暴露给父组件的方法
defineExpose({ setValue, getValue, clearValue, getHtml, getPreviewer, exportToFile });
</script>
<style scoped>
.markdown-container {
    position: relative;
    height: 100%;
}

.markdown-preview-layout {
    display: flex;
    height: 100%;
    gap: 20px;
}

.markdown-preview-content {
    flex: 1;
    min-width: 0;
    min-height: 0;
    position: relative;
}

.markdown-preview-catalog {
    width: 200px;
    flex-shrink: 0;
    overflow-y: auto;
    position: sticky;
    top: 0;
    align-self: flex-start;
    max-height: calc(100vh - 100px);
    border-left: 1px solid #eee;
    padding-left: 16px;
}
</style>