<template>
    <div class="app-unit">
        <div class="unit-title">
            <div class="t-value">友情链接</div>
        </div>
        <div class="unit-content">
            <template v-if="computedDataSource.length > 0">
                <ul>
                    <template v-for="(item, index) of computedDataSource" :key="item.id">
                        <li>
                            <a-tag :color="item.color">
                                {{ index + 1 }}
                            </a-tag>
                            <a :href="item.link_url" target="_blank" class="link-item" :title="item.name">
                                {{ item.name }}：{{ item.link_url }}
                            </a>
                        </li>
                    </template>
                </ul>
            </template>
            <template v-else>
                <div class="no-data">暂无数据</div>
            </template>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, computed, useAttrs } from 'vue';
import { handleItemClick } from '@/utils/utils';
import { useRouter } from "vue-router";

const router = useRouter();

// 透传对象属性和方法
const attrs = useAttrs();
const { dataSource, onPageChange } = attrs as {
    dataSource?: any[] | { value: any[] },
    onPageChange?: (index: number, size: number) => void,
    pagination?: {
        index: number,
        size: number,
        total: number
    }
};

// 处理列表项点击事件
const handleItemClickWrapper = (link_url: string) => {
    handleItemClick({}, link_url, router);
};

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

<style scoped>
.app-unit {
    border: 1px solid #ddd;
    border-radius: 5px;
}

.app-unit .unit-title {
    line-height: 40px;
    height: 40px;
    padding: 0px 10px 0px 10px;
    background-color: #e8e7e3;
    position: relative;
}

.app-unit .unit-title::after {
    content: '';
    display: block;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    /* z-index: -1; */
    border-bottom: 1px solid #ddd;
}

.app-unit .unit-title .t-value {
    float: left;
    font-size: 16px;
    color: #333;
    font-weight: 400;
}

.app-unit .unit-title .t-more {
    float: right;
    font-size: 14px;
    color: #999;
}

.app-unit .unit-title .t-value {
    font-size: 16px;
    color: #333;
    font-weight: 400;
}

.app-unit .unit-content {
    padding: 10px 15px 10px 15px;
}

.app-unit .unit-content>ul>li {
    line-height: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.app-unit .unit-content>ul>li>a {
    text-decoration: underline;
}

.app-unit .unit-content>ul>li>a:hover {
    color: #FF5722;
}

.layui-badge {
    height: 18px;
    line-height: 18px;
}
</style>
