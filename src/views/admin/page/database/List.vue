<template>
    <Modal
        v-model:open="modalRowOpen"
        :bind-modal-row="bindModalRow"
        modal-title="系统提示"
        :handle-ok="handleRowOk"
        :handle-cancel="handleRowCancel"
    >
        <template #form>
            <p>
                您确认要删除&nbsp;<span style="color:red;font-size:24px;">{{ bindModalRow.length }}</span>&nbsp;条数据吗？删除后不可恢复！
            </p>
        </template>
    </Modal>
    <Table
        select-type="checkbox"
        :data-source="dataSource"
        :columns="columns"
        :on-search="onSearch"
        :on-refresh="onRefresh"
        :on-row-add="onRowAdd"
        :on-row-delete="onRowDelete"
        :pagination="pagination"
        :on-page-change="onPageChange"
        :spinning="tableSpinning"
        :locale-empty-text="tableLocaleEmptyText"
        @on-selected="onSelected"
        @on-delete-multiple="onDeleteMultiple"
    >
        <template #add>
            <a-button
                v-if="onRowAdd"
                type="primary"
                ghost
                @click="onRowAdd"
            >
                备份数据库
            </a-button>
            <!-- <a-button v-if="onRowVacuum" @click="onRowVacuum" type="primary" ghost>压缩数据库</a-button> -->
        </template>
        <template #link="{ text, field }">
            <template v-if="field === 'link_url'">
                <a href="javascript:void(0)">{{ text }}</a>
            </template>
            <template v-else>
                <span>{{ text }}</span>
            </template>
        </template>
    </Table>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import { message } from "ant-design-vue";
// @ts-ignore
import SystemConfig from "@/SystemConfig.js";
// @ts-ignore
import request from "@/utils/request.js";
import { isValidValue } from "@/utils/utils.js";
import Table from "@/views/componentsPlus/Table.vue";
import Modal from "@/views/componentsPlus/Modal.vue";

/**
 * table模块
 */
// @ts-ignore
import tableConf from "./table.conf.js";
const { apiURL, uuidName, tableColumns } = tableConf;
const dataSource = ref([]);
const columns = ref(tableColumns);
const tableSpinning = ref(false);
const tableLocaleEmptyText = ref('');

// 搜索
const inputSearchValue = ref("");
const onSearch = (value: string) => {
    inputSearchValue.value = value;
    handleGetList();
}

// 刷新
const onRefresh = () => {
    handleGetList();
}
// 添加
const onRowAdd = () => {
    modalStatus.value = "add";
    modalTitle.value = "新增数据";
    resetFormValue();
    handleOk(new MouseEvent("click"));
};

// 打开弹窗

// 删除单行
const onRowDelete = (obj: any) => {
    onOpenRowDialog([obj[uuidName]]);
};
// Row弹出层逻辑
const modalRowOpen = ref<Boolean>(false);
const bindModalRow = ref(<any>[]);
const onOpenRowDialog = (arr: any) => {
    modalRowOpen.value = true;
    bindModalRow.value = arr;
}
const onCloseDialog = () => {
    modalRowOpen.value = false;
    bindModalRow.value = [];
}
const handleRowOk = () => {
    const arr = bindModalRow.value;
    handleDelete(arr);
    onCloseDialog();
}
const handleRowCancel = () => {

}
// 选中回调函数
const onSelected = () => {
    // console.log("选中的行数据:", selectedRows);
    // 在这里处理选中的行数据
    // 例如，可以将选中的数据存储到一个响应式变量中
    // selectedData.value = selectedRows;
};
// 多行删除回调函数
const onDeleteMultiple = (selectedRowKeys: any) => {
    onOpenRowDialog(selectedRowKeys);
}

// 分页
const onPageChange = (index: number, size: number) => {
    const value = pagination.value;
    value.index = index;
    value.size = size;
    handleGetList();
};
const pagination = ref(SystemConfig.page);

/**
 * 模态对话框
 */
const modalOpen = ref<Boolean>(false);
const modalStatus = ref("");
const modalTitle = ref("");
const showModal = (value: boolean = true) => {
    modalOpen.value = value === undefined ? true : value;
};
const handleOk = (_p0: MouseEvent) => {
    const value = modalStatus.value;
    if (value === "add") {
        handleAdd();
    } else if (value === "edit") {
        handleEdit();
    }
};

/**
 * from表单
 */
interface FormState {}
const formStateDefaultValue = <FormState>{};
const formState = reactive<FormState>(Object.assign({}, formStateDefaultValue));

// 处理表单
const resetFormValue = () => {
    const fromSource = formStateDefaultValue;
    let value = formState;
    Object.keys(value).forEach(key => {
        // @ts-ignore
        value[key] = fromSource[key];
    });
    value = Object.assign({}, formStateDefaultValue);
}

const handleGetList = () => {
    let requestParams = Object.assign({}, pagination.value);
    Object.assign(requestParams, {
        searchText: isValidValue(inputSearchValue.value) ? inputSearchValue.value : null
    });
    tableSpinning.value = true;
    let requestTiming: any = null;
    dataSource.value.length = 0;
    tableLocaleEmptyText.value = '';
    request({
        url: `${apiURL}`,
        params: requestParams
    }).then((data: any) => {
        requestTiming = data.requestTiming;
        // dataSource.value = data.result;
        data.result.forEach((element: any) => {
            // @ts-ignore
            dataSource.value.push(element);
        });
        // @ts-ignore
        const page = data.page || {};
        const val = pagination.value;
        val.total = page.total;
        //如果没有数据，则跳回上一页
        if (data.result.length < 1) {
            if (val.index > 1) {
                val.index = val.index - 1;
                setTimeout(() => {
                    handleGetList();
                }, 100);
            }
        }
    }).catch((err: any) => {
        requestTiming = err.requestTiming;
    }).finally(() => {
        setTimeout(() => {
            tableSpinning.value = false;
            requestTiming.isError ? tableLocaleEmptyText.value = requestTiming.message : null;
        }, requestTiming?.delayAdded);
    });
}
const handleAdd = () => {
    let sendForm = JSON.parse(JSON.stringify(formState));
    request({
        url: `${apiURL}`,
        method: "post",
        data: sendForm
    }).then(() => {
        handleGetList();
        showModal(false);
    }).catch((err: any) => {
        console.log(err);
    });
}

const handleEdit = () => {
    let sendForm = JSON.parse(JSON.stringify(formState));
    if (!sendForm.username) {
        message.error("缺少必填项");
        return false;
    }
    request({
        url: `${apiURL}`,
        method: "put",
        data: sendForm
    }).then(() => {
        handleGetList();
        showModal(false);
    }).catch((err: any) => {
        console.log(err);
    });
}

const handleDelete = (sendData: any) => {
    request({
        url: `${apiURL}/multiple`,
        method: "delete",
        data: sendData
    }).then(() => {
        handleGetList();
    }).catch((err: any) => {
        console.log(err);
    });
}

// 挂在事件
onMounted(async () => {
    // 使用 $nextTick 确保 DOM 已经渲染完成
    await nextTick(() => {
        handleGetList();
    });
});
</script>
<style scoped>
.tishi-info {
    margin-bottom: 4px;
}
</style>