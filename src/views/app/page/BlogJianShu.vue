<template>
    <template v-if="computedDataSource && computedDataSource.length > 0">
        <div class="app-unit x-list app-shadow">
            <div class="unit-title">
                <div class="t-value">
                    文章列表
                </div>
            </div>
            <div class="unit-content">
                <template v-for="item of computedDataSource" :key="item.id">
                    <a :href="`/app/blog?id=${item.id}`" target="_blank">
                        <div class="x-item">
                            <div class="item-title">
                                <a-tag v-if="item.readTop == 'true'" color="red">置顶</a-tag>
                                <span>{{ item.title }}</span>
                            </div>
                            <div class="item-content">
                                <div class="c-text">
                                    {{ item.jianshu }}
                                </div>
                                <div class="c-footer">
                                    <i class="iconfont"></i>
                                    <span>时间：{{ item.create_time }}</span>
                                </div>
                            </div>
                        </div>
                    </a>
                </template>
                <!--分页-->
                <template v-if="computedDataSource && computedDataSource.length > 0">
                    <div class="a-page-box">
                        <a-pagination
                            :current="index"
                            :page-size="size"
                            :total="total"
                            :show-total="() => `共计 ${total} 条`"
                            @change="onChange"
                        />
                    </div>
                </template>
            </div>
        </div>
    </template>
</template>
<script setup lang="ts">
import { onMounted, nextTick, computed } from "vue";

// 定义 props
const props = withDefaults(defineProps<{
    dataSource?: any[] | { value: any[] },
    onPageChange?: (index: number, size: number) => void,
    pagination?: {
        index: number,
        size: number,
        total: number
    }
}>(), {});

// 计算属性，用于处理 dataSource
const computedDataSource = computed(() => {
    if (Array.isArray(props.dataSource)) {
        return props.dataSource;
    } else if (props.dataSource && props.dataSource.value && Array.isArray(props.dataSource.value)) {
        return props.dataSource.value;
    }
    return [];
});

// 分页
const size = computed(() => props.pagination?.size || 0);
const index = computed(() => props.pagination?.index || 1);
const total = computed(() => props.pagination?.total || 0);
const onChange = (current: number, pageSize: number) => {
    // 调用父组件传递的 onPageChange 函数
    if (props.onPageChange) {
        props.onPageChange(current, pageSize);
    }
};

onMounted(async function () {
    // 使用 $nextTick 确保 DOM 已经渲染完成
    await nextTick(() => {

    });
});
</script>
<style scoped>
.x-item {
    padding: 10px 20px 10px 20px;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
}

.x-item:hover {
    background-color: #ffffff;
    color: #333;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.x-item .item-title {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    color: #666;
    /* 长标题允许换行，避免小屏横向溢出 */
    flex-wrap: wrap;
    gap: 4px;
    word-break: break-word;
}

.x-item .item-content {
    padding: 5px 0px 5px 0px;
    font-size: 14px;
}

.x-item .item-content .c-text {
    font-size: 14px;
    color: #777;
    word-wrap: break-word;
    word-break: break-word;
    overflow: hidden;
}

.x-item .item-content .c-footer {
    margin-top: 10px;
    font-size: 12px;
    color: #999;
}

.a-page-box {
    padding: 20px;
    text-align: center;
    background-color: #e6f4ff;
    position: relative;
}

.a-page-box::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: -1px;
    left: 0;
    z-index: -1;
    border: 1px solid #91caff;
    border-radius: 5px;
}

/* 平板及以下：收紧列表项内边距与标题字号 */
@media (max-width: 991px) {
    .x-item {
        padding: 10px 14px;
    }

    .x-item .item-title {
        font-size: 16px;
    }
}

/* 手机：分页区收窄，避免挤压 */
@media (max-width: 767px) {
    .x-item {
        padding: 10px 12px;
    }

    .x-item .item-title {
        font-size: 15px;
    }

    .x-item .item-content .c-text {
        font-size: 13px;
    }

    .a-page-box {
        padding: 14px 8px;
    }
}
</style>
