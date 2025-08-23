<template>
    <div class="a-table-box">
        <!--顶部按钮区-->
        <div class="a-table-button">
            <div class="layout-scape">
                <a-space>
                    <slot name="refresh" label="刷新数据"></slot>
                    <slot name="layout-left" label="左侧插槽"></slot>
                </a-space>
            </div>
            <div class="layout-scape-right">
                <a-space>
                    <slot name="layout-right" label="右侧插槽"></slot>
                    <slot name="add" label="新增数据"></slot>
                    <a-popconfirm v-if="rowSelection && props.selectType !== 'radio'" title="删除后不可恢复，是否确认删除?"
                        @confirm="onDeleteMultiple">
                        <a-button type="primary" ghost>删除数据</a-button>
                    </a-popconfirm>
                </a-space>
            </div>
        </div>
        <!--表格主体-->
        <div class="a-table-contaner">
            <div class="table-container-body">
                <a-table ref="rootElement" size="small" :row-selection="rowSelection" :dataSource="dataSource"
                    :columns="columns" :pagination="false" bordered>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column[uuidName] !== undefined">
                            <div>
                                {{ text }}
                            </div>
                        </template>
                        <template v-else-if="column.dataIndex === 'operation'">
                            <a-flex gap="small">
                                <slot name="operation-row" :data="record"></slot>
                                <a v-if="onEdit" @click="onEdit(record[uuidName])">Edit</a>
                                <a-popconfirm v-if="onDelete" title="删除后不可恢复，是否确认删除?"
                                    @confirm="onDelete(record[uuidName])">
                                    <a>Delete</a>
                                </a-popconfirm>
                            </a-flex>
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
        <!--分页-->
        <div class="a-table-page-box">
            <a-pagination v-model:current="pagination.index" v-model:pageSize="pagination.size"
                :total="pagination.total" :show-total="total => `共计 ${total} 条`" @change="onPaginationChange" />
        </div>
    </div>

</template>
<script lang="ts" setup>
import { ref, defineProps, watch, withDefaults, onMounted, nextTick, computed, unref } from "vue";
import { message, Table } from 'ant-design-vue';
// 接收父层传递对象
const props = defineProps({
    uuidName: {
        type: String,
        required: false,
        default: "id"
    },
    selectType: {
        type: String,
        required: false,
        default: "checked"
    },
    dataSource: Object,
    columns: Object,
    pagination: {
        type: <any>Object
    },
    onEdit: {
        type: Function,
        required: false
    },
    onDelete: {
        type: Function,
        required: false
    },
    onAdd: {
        type: Function,
        required: false
    },
    onPaginationChange: {
        type: Function,
        required: false
    },
    onSelected: {
        type: Function,
        required: false
    }
});

/**
 * 接收父层传递所有方法，这些方法是为了执行给父层使用
 */
const emit = defineEmits(["onSelected", "onDeleteMultiple"]);

/**
 * 定义组件内部使用数据
 */
// 接收实际数据，instartDataSource对象是最终渲染的数据，因为涉及到模拟数据获取滚动条的问题，最终使用变量instartDataSource
const dataSource = ref(props.dataSource);
const instartDataSource = ref([]);
const columns = ref(props.columns);
const pagination = ref(props.pagination);
const { onEdit, onDelete } = { ...props };
const rootElement = ref(null);

/**
 * 删除多行
 */
const onDeleteMultiple = () => {
    if (selectedRowKeys.value.length > 0) {
        emit("onSelected", selectedRowKeys.value);
    }
}


/**
 * 表格的选中回调
 */
interface DataType {
    id: number | string
}
const selectedRowKeys = ref<DataType['id'][]>([]); // Check here to configure the default column
const onChange = (changableRowKeys: number[], changableRowData: any) => {
    // console.log('selectedRowKeys changed: ', changableRowKeys,changableRowData);
    selectedRowKeys.value = changableRowKeys;
    emit("onSelected", changableRowData);
};

const selectTypeValues = ["radio", "checked"];
const rowSelection = computed(() => {
    if (props.selectType !== undefined && props.selectType !== null) {
        if (!selectTypeValues.includes(props.selectType)) {
            return null;
        }
    }
    return {
        type: props.selectType,
        selectedRowKeys: unref(selectedRowKeys),
        onChange: onChange,
        hideDefaultSelections: false,
    };
});

const getSelected = () => {
    const list = dataSource.value.filter((item) => {
        return selectedRowKeys.value.includes(item.key);
    });
    return JSON.parse(JSON.stringify(list));
}
// 暴露给父组件的方法
defineExpose({ getSelected });

// 挂载事件
onMounted(async function(){
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
.a-table-contaner{
    position: relative;
}
.table-container-body{
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
