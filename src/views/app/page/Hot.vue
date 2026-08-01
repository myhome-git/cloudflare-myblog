<template>
    <div class="app-unit app-shadow">
        <div class="unit-title">
            <div class="t-value">
                热门排行
            </div>
        </div>
        <div class="unit-content">
            <template v-if="computedDataSource.length > 0">
                <ul>
                    <template v-for="(item, index) of computedDataSource" :key="item.id">
                        <li>
                            <a-tag :color="item.color">
                                {{ Number(index) + 1 }}
                            </a-tag>
                            <a href="javascript:void(0)" :title="item.title" @click="handleItemClickWrapper(item.id)">
                                {{ item.title }}
                            </a>
                        </li>
                    </template>
                </ul>
            </template>
            <template v-else>
                <div class="no-data">
                    暂无数据
                </div>
            </template>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, useAttrs } from 'vue';
import { handleItemClick } from '@/utils/utils';
import { useRouter } from "vue-router";

const router = useRouter();

// 透传对象属性和方法
const attrs = useAttrs() as Record<string, any>;
const dataSource = attrs['data-source'] ?? attrs.dataSource;

// 处理列表项点击事件
const handleItemClickWrapper = (id: string) => {
    handleItemClick({ id: id }, '/app/blog', router, false);
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
.layui-badge {
    height: 18px;
    line-height: 18px;
}
</style>
