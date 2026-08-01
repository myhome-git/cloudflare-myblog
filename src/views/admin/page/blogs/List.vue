<template>
    <Modal
        v-model:open="modalOpen"
        :modal-status="modalStatus"
        :modal-title="modalTitle"
        :width="modalWidth"
        :height="modalHeight"
        :mask-closable="false"
        :handle-ok="handleOk"
        :handle-cancel="handleCancel"
    >
        <template #form>
            <a-form
                :model="formState"
                name="basic"
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 20 }"
                autocomplete="off"
            >
                <a-form-item label="分类：" name="classId" :rules="[{ required: false, message: '未选择任何选项' }]">
                    <Select v-model:value="formState.classId" :options="formClassList" style="width:300px"></Select>
                </a-form-item>
                <a-form-item label="标题：" name="title" :rules="[{ required: true, message: '请输入标题' }]">
                    <a-input v-model:value="formState.title" />
                </a-form-item>
                <a-form-item label="标签：" name="tags" :rules="[{ required: false, message: '请输入标签，多个标签可以用逗号隔开' }]">
                    <a-input v-model:value="formState.tags" />
                </a-form-item>
                <a-form-item label="内容：" name="content" :rules="[{ required: true, message: '请输入内容' }]">
                    <MarkdownEditor ref="refFormContent" :height="`calc(${modalHeight}px - 500px)`" />
                </a-form-item>
                <a-form-item label=" " name="name" :rules="[{ required: false, message: '请输入是否置顶' }]">
                    <a-checkbox v-model:checked="formState.readTop">
                        是否置顶
                    </a-checkbox>
                </a-form-item>
            </a-form>
        </template>
    </Modal>
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
        :on-row-edit="onRowEdit"
        :on-row-delete="onRowDelete"
        :pagination="pagination"
        :on-page-change="onPageChange"
        :spinning="tableSpinning"
        :locale-empty-text="tableLocaleEmptyText"
        @on-selected="onSelected"
        @on-delete-multiple="onDeleteMultiple"
    >
        <template #link="{ text, record, field }">
            <template v-if="field === 'title'">
                <a class="blog-title" :href="`/app/blog?id=${record[uuidName]}`" target="_blank">{{ text }}</a>
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
import request from "@/utils/request.js";
import { isValidValue, getKey, handleEncodemultiple, handleDecodemultiple } from "@/utils/utils.js";
import Table from "@/views/componentsPlus/Table.vue";
import Modal from "@/views/componentsPlus/Modal.vue";
import Select from "@/views/componentsPlus/Select.vue";
import MarkdownEditor from "@/views/componentsPlus/MarkdownEditor.vue";

/**
 * table模块
 */
// @ts-ignore
import tableConf from "./table.conf.js";
const { apiURL, uuidName, tableColumns, confPage } = tableConf;
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
    showModal();
};
// 编辑
const onRowEdit = (v: any) => {
    modalStatus.value = "edit";
    modalTitle.value = "更新数据";
    const d = (dataSource.value.filter(item => v[uuidName] === item[uuidName])[0]);
    // formState.value = d;

    // 获取更详细的数据
    request({
        url: `${apiURL}`,
        params: { id: d[uuidName] }
    }).then((data: any) => {
        let rowData = data?.result[0];
        rowData = handleDecodemultiple(rowData, rowData.key, ["title", "content"]);
        resetFormValue();
        setFormValue(rowData);
        setTimeout(() => {
            refFormContent.value?.setValue(rowData.content);
        }, 500);
        // modalEditData.value = value;
        showModal();
    }).catch((err: any) => {
        console.log(err);
    });

};
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
const pagination = ref(confPage);

/**
 * 模态对话框
 */
const modalOpen = ref<Boolean>(false);
const modalWidth = ref(Math.max(1024, window.screen.width - 100));
const modalHeight = ref(Math.max(768, window.screen.height - 100));
const modalStatus = ref("");
const modalTitle = ref("");
const showModal = (value: boolean = true) => {
    modalOpen.value = value === undefined ? true : value;
};
const handleOk = async () => {
    const value = modalStatus.value;
    let result = false;
    if (value === "add") {
        result = await handleAdd();
    } else if (value === "edit") {
        result = await handleEdit();
    }
    if (result) {
        handleGetList();
        showModal(false);
        refFormContent.value?.clearValue();
    }
    return result;
};
const handleCancel = () => {
    refFormContent.value?.clearValue();
}

/**
 * from表单
 */
const refFormContent = ref<{
    setValue: (value: string) => void;
    getValue: () => string;
    clearValue: () => void;
        } | null>(null);
interface FormState {
    classId: number | null;
    title: string;
    tags: string;
    key: string;
    content: string;
    readTop: boolean;
}
const formClassList = ref<any>(null);
const formStateDefaultValue = <FormState>{
    classId: null,
    title: "",
    tags: "",
    key: "",
    content: "",
    readTop: false,
};
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
const setFormValue = (obj: any) => {
    resetFormValue();
    const value = formState;
    Object.keys(obj).forEach(key => {
        // @ts-ignore
        value[key] = obj[key];
    });
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
        url: `${apiURL}/query/list/simple`,
        params: requestParams
    }).then((data: any) => {
        requestTiming = data.requestTiming;
        // dataSource.value = data.result;
        data.result.forEach((element: any) => {
            element = handleDecodemultiple(element, element.key, ["title"]);
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
// 获取表单class列表
const handleGetClassList = async () => {
    request({
        url: `/api/admin/blogClass`,
        params: {}
    }).then((data: any) => {
        const list: any = [{ label: "请选择", value: null }];
        data.result.forEach((element: any) => {
            list.push({
                label: element.name,
                value: element.id
            });
        });
        formClassList.value = list;
    }).catch((err: any) => {
        console.log(err);
    });
}
const handleAdd = async (): Promise<boolean> => {
    let sendForm = JSON.parse(JSON.stringify(formState));
    sendForm.key = getKey();
    sendForm.content = refFormContent.value?.getValue();
    sendForm = handleEncodemultiple(sendForm, sendForm.key, ["title", "content"]);
    sendForm.readTop = `${sendForm.readTop}`;
    if (!sendForm.title || !sendForm.content) {
        message.error("缺少必填项");
        return false;
    }
    try {
        await request({
            url: `${apiURL}`,
            method: "post",
            data: sendForm
        })
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const handleEdit = async (): Promise<boolean> => {
    let sendForm = JSON.parse(JSON.stringify(formState));
    sendForm.key = getKey();
    sendForm.content = refFormContent.value?.getValue();
    sendForm = handleEncodemultiple(sendForm, sendForm.key, ["title", "content"]);
    sendForm.readTop = `${sendForm.readTop}`;
    if (!sendForm.title || !sendForm.content) {
        message.error("缺少必填项");
        return false;
    }
    try {
        await request({
            url: `${apiURL}`,
            method: "put",
            data: sendForm
        })
        return true;
    } catch (error) {
        console.log(error);
        return false
    }
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
// 挂载事件
onMounted(async () => {
    // 使用 $nextTick 确保 DOM 已经渲染完成
    await nextTick(() => {
        handleGetList();
        handleGetClassList();
    });
});
</script>
<style scoped>
.blog-title {
    color: #1677ff;
}
</style>
