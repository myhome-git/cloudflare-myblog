<template>
    <div class="app-header">
        <Logo></Logo>
        <Search @on-search="onSearch"></Search>
        <div class="header-menu">
            <HeaderLogin></HeaderLogin>
        </div>
    </div>
</template>
<script lang="ts" setup>
import Logo from './Logo.vue';
import Search from './Search.vue';
import HeaderLogin from './HeaderLogin.vue';

const emit = defineEmits(["onSearch"]);
const onSearch = (value: string) => {
    emit('onSearch', value);
}
</script>
<style scoped>
/**
 * ≥ 992px：Logo 左、搜索居中、登录右，整行 100px 高（保持原视觉）
 * < 992px ：搜索框换到第二行，Logo 与登录仍在第一行
 * < 480px ：搜索框占满整行
 */
.app-header {
    padding: 20px 0;
    position: relative;
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: var(--app-header-height);
}

.app-header :deep(.app-logo) {
    position: static;
    flex: none;
}

.app-header :deep(.x-head-search) {
    position: static;
    flex: 1 1 auto;
    max-width: 320px;
    margin: 0;
}

.app-header .header-menu {
    position: static;
    flex: none;
    width: 140px;
    margin-left: auto;
}

/* 中等屏：压缩间距 */
@media (max-width: 991px) {
    .app-header {
        padding: 14px 0;
        flex-wrap: wrap;
        row-gap: 10px;
        min-height: 0;
    }

    .app-header :deep(.x-head-search) {
        order: 3;
        flex: 1 1 100%;
        max-width: none;
    }
}

/* 手机：Logo 缩小、登录区收窄 */
@media (max-width: 767px) {
    .app-header {
        padding: 12px 0;
        gap: 10px;
    }

    .app-header :deep(.app-logo span) {
        font-size: 22px;
    }

    .app-header :deep(.app-logo p) {
        font-size: 12px;
    }

    .app-header .header-menu {
        width: auto;
    }
}
</style>
