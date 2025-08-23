<template>
    <div class="a-table-box">
        <!--顶部按钮区-->
        <div class="a-table-button">
            <div class="layout-scape">
                <a-space>
                    <slot name="inputSearch">
                        <a-input-search v-model:value="inputSearchValue" @search="onSearch" placeholder="请输入搜索选项"
                            enter-button />
                    </slot>
                    <slot name="refrech">
                        <a-button v-if="onRefresh" @click="onRefresh" type="primary" ghost>刷新数据</a-button>
                    </slot>
                    <slot name="add">
                        <a-button v-if="onRowAdd" @click="onRowAdd" type="primary" ghost>新增数据</a-button>
                    </slot>
                    <slot name="button-layout-left" label="左侧插槽"></slot>
                </a-space>
            </div>
            <div class="layout-scape-right">
                <a-space>
                    <slot name="button-layout-right" label="右侧插槽"></slot>
                    <slot name="deleteMultiple">
                        <a-button v-if="onDeleteMultiple && attrs.selectType === 'checkbox'" type="primary" ghost
                            @click="onDeleteMultiple">批量删除</a-button>
                    </slot>
                </a-space>
            </div>
        </div>
        <!--表格主体-->
        <div class="a-table-contaner">
            <div class="table-container-body">
                <a-spin :spinning="isValidValue(spinning) ? spinning : false" tip="数据加载中...">
                    <a-table ref="refAntTable" size="small" v-bind="attrs" :pagination="false" bordered
                        :row-selection="rowSelection" :row-key="uuidName || `id`"
                        :locale="{ emptyText: localeEmptyText }">
                        <!-- 循环 slots 对象，将所有插槽（包括作用域插槽）都透传下去 -->
                        <template v-for="(_, name) in slots" #[name]="scopedData">
                            <slot :name="name" v-bind="scopedData"></slot>
                        </template>
                        <template #bodyCell="{ column, text, record }">
                            <!-- 如果父组件提供了 link 插槽，则传递字段信息给插槽 -->
                            <template v-if="slots.link && column.dataIndex !== 'operation'">
                                <slot name="link" :text="text" :record="record" :field="column.dataIndex"></slot>
                            </template>
                            <!-- 否则使用默认渲染 -->
                            <template v-else-if="column.dataIndex === 'operation'">
                                <a-space size="small">
                                    <slot name="operation-row" :record="record"></slot>
                                    <slot name="rowEdit" :record="record">
                                        <a-button v-if="onRowEdit" @click="onRowEdit(record)" size="small"
                                            type="primary" ghost>
                                            <template #icon>
                                                <EditOutlined />
                                            </template>
                                            Edit
                                        </a-button>
                                    </slot>
                                    <slot name="rowDelete" :record="record">
                                        <a-button v-if="onRowDelete" size="small" type="primary" danger ghost
                                            @click="onRowDelete(record)">
                                            <template #icon>
                                                <DeleteOutlined />
                                            </template>
                                            Delete
                                        </a-button>
                                    </slot>
                                </a-space>
                            </template>
                            <template v-else>
                                <div>
                                    {{ text }}
                                </div>
                            </template>
                        </template>
                    </a-table>
                </a-spin>
            </div>
        </div>
        <!--分页-->
        <div class="a-table-page-box">
            <a-pagination :current="index" :page-size="size" :total="total" :show-total="() => `共计 ${total} 条`"
                @change="onChange" />
        </div>
    </div>

</template>
<script lang="ts" setup>
import { ref, defineProps, useAttrs, useSlots, watch, withDefaults, onMounted, nextTick, computed, unref } from "vue";
import { message, Table } from 'ant-design-vue';
import { EditOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons-vue';
import { isValidValue } from "@/utils/utils";

// 透传对象属性和方法
const attrs = useAttrs();
const slots = useSlots();
// console.log(`table透传对象`, attrs);
// console.log(`table透传插槽`, slots);
const { selectType, dataSource, uuidName, onSearch, onRefresh, onRowAdd, onRowEdit, onRowDelete, onPageChange } = attrs as {
    uuidName?: string,
    selectType?: 'radio' | 'checkbox',
    dataSource?: any[] | { value: any[] },
    onSearch?: (value: string) => void,
    onRefresh?: () => void,
    onRowAdd?: () => void,
    onRowEdit?: (value: any) => void,
    onRowDelete?: (value: any) => void,
    onPageChange?: (index: number, size: number) => void,
    pagination?: {
        index: number,
        size: number,
        total: number
    },
    spinning?: boolean
};

/**
 * 接收父层传递所有方法，这些方法是为了执行给父层使用
 */
const emit = defineEmits(["onSelected", "onDeleteMultiple", "onPageChange"]);

// 定义ref对象
const refAntTable = ref(null);

/**
 * 搜索选项
 */
const inputSearchValue = ref("");

/**
 * 删除多行
 */
const onDeleteMultiple = () => {
    if (selectedRowKeys.value.length > 0) {
        emit("onDeleteMultiple", selectedRowKeys.value);
    }
}


/**
 * 表格的选中回调
 */
interface DataType {
    id: number | string
}
const selectedRowKeys = ref<DataType['id'][]>([]); // Check here to configure the default column
const onSelected = (changableRowKeys: number[], changableRowData: any) => {
    // console.log('selectedRowKeys changed: ', changableRowKeys, changableRowData);
    selectedRowKeys.value = changableRowKeys;
    emit("onSelected", changableRowData);
};

const selectTypeValues = ["radio", "checkbox"];
const rowSelection = computed(() => {
    if (selectType && !selectTypeValues.includes(selectType.toString())) {
        return null;
    }
    return {
        type: selectType,
        selectedRowKeys: unref(selectedRowKeys),
        onChange: onSelected,
        hideDefaultSelections: false,
    };
});

const getSelected = () => {
    if (!dataSource) return [];
    const list = ('value' in dataSource ? dataSource.value : dataSource).filter((item: any) => {
        return selectedRowKeys.value.includes(item.id);
    });
    return JSON.parse(JSON.stringify(list));
}

// 分页
const pagination = attrs.pagination as { index: number, size: number, total: number } | undefined;
const size = computed(() => pagination?.size || 0);
const index = computed(() => pagination?.index || 1);
const total = computed(() => pagination?.total || 0);
const spinning = computed(() => attrs.spinning || false);
const localeEmptyText = computed(() => isValidValue(attrs.localeEmptyText) ? attrs.localeEmptyText : '暂无数据');
const onChange = (current: number, pageSize: number) => {
    const pagination = attrs.pagination as { index: number, size: number } | undefined;
    if (pagination) {
        pagination.index = current;
        pagination.size = pageSize;
    }
    // 调用父组件传递的 onPageChange 函数
    if (onPageChange) {
        onPageChange(current, pageSize);
    }
}

// 暴露给父组件的方法
defineExpose({ getSelected });

// 挂载事件
onMounted(async function () {
    // 使用 $nextTick 确保 DOM 已经渲染完成
    await nextTick(() => {

    });
});
</script>
<style scoped>
.a-table-box {
    display: grid;
    grid-template-rows: auto 1fr auto;
    /* 三行：自动高度，弹性空间，自动高度 */
    height: 100%;
    /* 设置容器高度 */
    overflow: hidden;
}

.ant-table-wrapper {
    overflow: auto;
}

.a-table-button {
    padding: 10px;
    display: grid;
    grid-template-columns: auto 1fr;
}

.a-table-button:empty {
    padding: 0;
    /* 如果 div 没有子元素，则 padding 为 0 */
    display: none;
}

.a-table-contaner {
    position: relative;
}

.table-container-body {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
}

.layout-scape-right {
    display: flex;
    justify-content: flex-end;
    /* 将子元素对齐到右侧 */
}

.a-table-page-box {
    padding: 6px 30px;
    border-top: 1px solid #f5f5f5;
}
</style>
