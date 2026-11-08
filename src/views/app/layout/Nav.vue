<template>
    <div class="app-nav">
        <!-- 分类列表：大屏常驻；手机端默认收起，由 Header 的图标控制展开 -->
        <div class="nav-list" :class="{ 'is-open': open }">
            <div
                class="li"
                :class="{ active: route.query.classId === 'home' }"
                @click="handleItemClickWrapper({}, '/')"
            >
                Home
            </div>
            <template v-if="computedDataSource.length > 0">
                <div
                    v-for="item of computedDataSource"
                    :key="item.id"
                    class="li"
                    :class="{ active: route.query.classId === `${item.id}` }"
                    @click="handleItemClickWrapper({ classId: item.id }, '/')"
                >
                    <span>{{ item.name }}</span>
                </div>
            </template>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, useAttrs } from 'vue';
import { handleItemClick } from '@/utils/utils';
import { useRoute, useRouter } from "vue-router";

// 手机端展开状态由父级（Index.vue）通过 Header 的图标控制
withDefaults(defineProps<{ open?: boolean }>(), { open: false });

const route = useRoute();
const router = useRouter();

// 处理列表项点击事件
const handleItemClickWrapper = (obj: any, url: string) => {
    handleItemClick(obj, url, router, false);
};

// 透传对象属性和方法
const attrs = useAttrs() as Record<string, any>;
const dataSource = attrs['data-source'] ?? attrs.dataSource;
// 计算属性，用于处理 dataSource
const computedDataSource = computed(() => {
    if (Array.isArray(dataSource)) {
        return dataSource;
    } else if (dataSource && dataSource.value && Array.isArray(dataSource.value)) {
        return dataSource.value;
    }
    return [];
});
</script>
<style>
/* ============ 大屏（≥ 768px）：横向导航，保持原视觉 ============ */
.app-nav {
    line-height: 50px;
    display: flex;
    align-items: center;
    list-style: none;
    position: relative;
}

/* 汉堡按钮已移到 Header，这里不再需要 */
.nav-list {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex: 1 1 auto;
    min-width: 0;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.nav-list::-webkit-scrollbar {
    display: none;
}

.app-nav::before {
    display: block;
    content: '';
    height: 100%;
    border-left: 1px solid #ddd;
    position: absolute;
    left: 0;
    top: 0;
}

.app-nav::after {
    display: block;
    content: '';
    height: 100%;
    border-right: 1px solid #ddd;
    position: absolute;
    right: 0;
    top: 0;
}

.app-nav .li {
    padding: 0px 20px 0px 20px;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    color: #666;
    position: relative;
    /* 防止 flex 压缩文字 */
    flex: none;
    white-space: nowrap;
}

.app-nav .li::after {
    display: block;
    content: '';
    transition: all 0.3s;
    position: absolute;
    top: 18px;
    right: -1px;
    height: 16px;
    border-right: 1px solid #ccc;
}

.app-nav .li:first-child::before {
    display: none;
}

.app-nav .li:last-child::after {
    display: none;
}

.app-nav .li.active {
    color: #fff;
    background-color: #3f3f3f
}

.app-nav .li:hover {
    color: #fff;
    background-color: rgba(63, 63, 63, 0.7);
}

/* ============ 平板（≤ 991px）：缩小字号与间距 ============ */
@media (max-width: 991px) {
    .app-nav {
        line-height: 44px;
    }

    .app-nav .li {
        padding: 0px 14px;
        font-size: 16px;
    }

    .app-nav .li::after {
        top: 14px;
    }
}

/* ============ 手机（≤ 767px）：收成汉堡菜单 ============ */
@media (max-width: 767px) {
    .app-nav {
        line-height: 40px;
        flex-wrap: wrap;
        /* 手机端不需要两端竖线 */
        border-bottom: 1px solid #ddd;
    }

    .app-nav::before,
    .app-nav::after {
        display: none;
    }

    /* 收起时隐藏列表 */
    .nav-list {
        display: none;
        flex-direction: column;
        align-items: stretch;
        width: 100%;
        overflow: visible;
    }

    /* 展开：纵向排列，每项整行可点 */
    .nav-list.is-open {
        display: flex;
        border-top: 1px solid #ddd;
    }

    .nav-list .li {
        padding: 0 14px;
        font-size: 15px;
        line-height: 40px;
        border-bottom: 1px solid #eee;
    }

    /* 手机端纵向列表不需要分隔竖线 */
    .nav-list .li::after {
        display: none;
    }

    .nav-list .li:last-child {
        border-bottom: 0;
    }
}
</style>

