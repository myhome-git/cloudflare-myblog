<template>
    <div class="app-content">
        <div class="app-content-left">
            <slot name="left"></slot>
        </div>
        <div class="app-content-right">
            <slot name="right"></slot>
        </div>
    </div>
</template>
<script lang="ts" setup>
</script>

<style scoped>
/**
 * 大屏：左侧正文 + 右侧栏悬浮在容器右侧（沿用原有视觉）
 * 小屏：改为上下堆叠，正文在上、热门/友链在下
 */
.app-content {
    margin: 20px 0;
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

.app-content-left {
    min-width: 0;
    flex: 1;
    min-height: 0;
}

/* ≥ 768px：保持右侧栏绝对定位，位置由 CSS 变量控制，随容器宽度变化 */
@media (min-width: 768px) {
    .app-content-right {
        min-width: 0;
        position: absolute;
        left: calc(100% + var(--app-aside-gap));
        width: var(--app-aside-width);
        top: 0;
    }
}

/* < 768px：取消绝对定位，侧栏落到正文下方，整宽显示 */
@media (max-width: 767px) {
    .app-content {
        margin: 12px 0;
    }

    .app-content-right {
        min-width: 0;
        position: static;
        width: 100%;
        margin-top: 12px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
}
</style>
