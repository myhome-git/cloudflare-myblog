<template>
    <div class="app-header">
        <Logo></Logo>
        <Search @on-search="onSearch"></Search>
        <div class="header-menu">
            <HeaderLogin></HeaderLogin>
            <!-- 手机端：在登录按钮旁显示导航展开图标 -->
            <button
                type="button"
                class="header-nav-toggle"
                :aria-expanded="navOpen ? 'true' : 'false'"
                aria-label="展开分类导航"
                @click="emit('toggleNav')"
            >
                <MenuOutlined v-if="!navOpen" />
                <CloseOutlined v-else />
            </button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import Logo from './Logo.vue';
import Search from './Search.vue';
import HeaderLogin from './HeaderLogin.vue';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons-vue';

defineProps<{ navOpen?: boolean }>();
const emit = defineEmits(["onSearch", "toggleNav"]);
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
    /* 只参与 flex 布局；不覆盖其 position: relative（内部按钮以此为定位基准） */
    flex: 1 1 auto;
    max-width: 320px;
    margin: 0;
}

.app-header .header-menu {
    position: static;
    flex: none;
    width: 140px;
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
}

/* 分类导航展开按钮：仅手机端显示（在登录按钮旁边） */
.header-nav-toggle {
    display: none;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #666;
    font-size: 20px;
    cursor: pointer;
}

.header-nav-toggle:hover {
    color: #FF5722;
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

    /* 手机端显示分类展开按钮 */
    .header-nav-toggle {
        display: inline-flex;
    }
}
</style>
