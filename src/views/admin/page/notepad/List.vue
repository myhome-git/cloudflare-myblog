<template>
    <Modal v-model:open="modalOpen" :modalStatus="modalStatus" :modalTitle="modalTitle" :width="modalWidth"
        :height="modalHeight" :maskClosable="modalStatus == 'view'" :handleOk="handleOk" :handleCancel="handleCancel">
        <template v-slot:form>
            <a-form :model="formState" name="basic" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }"
                autocomplete="off">
                <a-form-item label="内容：" name="content" :rules="[{ required: true, message: '请输入内容' }]">
                    <MarkdownEditor ref="refFormContent" :type="modalStatus" :height="`calc(${modalHeight}px - 200px)`" />
                </a-form-item>
            </a-form>
        </template>
    </Modal>
    <Modal :bindModalRow="bindModalRow" v-model:open="modalRowOpen" modalTitle="系统提示" :handleOk="handleRowOk"
        :handleCancel="handleRowCancel">
        <template v-slot:form>
            <p>您确认要删除&nbsp;<span style="color:red;font-size:24px;">{{ bindModalRow.length }}</span>&nbsp;条数据吗？删除后不可恢复！
            </p>
        </template>
    </Modal>
    <Table selectType="checkbox" :dataSource="dataSource" :columns="columns" :onSearch="onSearch" :onRefresh="onRefresh"
        :onRowAdd="onRowAdd" :onRowEdit="onRowEdit" :onRowDelete="onRowDelete" :pagination="pagination"
        :onPageChange="onPageChange" @onSelected="onSelected" @onDeleteMultiple="onDeleteMultiple"
        :spinning="tableSpinning" :localeEmptyText="tableLocaleEmptyText">
        <template #link="{ text, record, field }">
            <template v-if="field === 'jianshu'">
                <a class="blog-title" href="javascript:void(0)" @click="rowTitleClick(record)">{{ text }}</a>
            </template>
            <template v-else>
                <span>{{ text }}</span>
            </template>
        </template>
        <template #operation-row="{ record }">
            <a-button v-if="rowTitleClick" size="small" type="primary" ghost @click="rowTitleClick(record)">
                <template #icon>
                    <EyeOutlined />
                </template>
                View
            </a-button>
        </template>
    </Table>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import { message } from "ant-design-vue";
import { EyeOutlined } from '@ant-design/icons-vue';
// @ts-ignore
import request from "@/utils/request.js";
import { isValidValue, getKey, handleEncodemultiple, handleDecodemultiple } from "@/utils/utils.js";
import Table from "@/views/componentsPlus/Table.vue";
import Modal from "@/views/componentsPlus/Modal.vue";
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
// 点击预览
const rowTitleClick = (v: any) => {
    modalStatus.value = "view";
    modalTitle.value = "预览数据";
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
}
// 添加
const onRowAdd = (key: string) => {
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
const onSelected = (selectedRows: any[]) => {
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
const modalStatus = ref("");
const modalTitle = ref("");
const modalWidth = ref(Math.max(1024, window.screen.width - (modalStatus.value == 'view' ? 600 : 400)));
const modalHeight = ref(Math.max(768, window.screen.height - (modalStatus.value == 'view' ? 400 : 200)));
const showModal = (value: boolean = true) => {
    modalOpen.value = value === undefined ? true : value;
};
const handleOk = async (e: MouseEvent) => {
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
        url: `${apiURL}`,
        params: requestParams
    }).then((data: any) => {
        requestTiming = data.requestTiming;
        data.result.forEach((element: any) => {
            element = handleDecodemultiple(element, element.key, ["content"]);
            element.jianshu = element.content.substring(0, 50);
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

const handleAdd = async (): Promise<boolean> => {
    let sendForm = JSON.parse(JSON.stringify(formState));
    sendForm.key = getKey();
    sendForm.content = refFormContent.value?.getValue();
    sendForm = handleEncodemultiple(sendForm, sendForm.key, ["content"]);
    if (!sendForm.content) {
        message.error("缺少必填项");
        return false;
    }
    try {
        request({
            url: `${apiURL}`,
            method: "post",
            data: sendForm
        });
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
    sendForm = handleEncodemultiple(sendForm, sendForm.key, ["content"]);
    if (!sendForm.content) {
        message.error("缺少必填项");
        return false;
    }
    try {
        await request({
            url: `${apiURL}`,
            method: "put",
            data: sendForm
        });
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

const handleDelete = (sendData: any) => {
    request({
        url: `${apiURL}/multiple`,
        method: "delete",
        data: sendData
    }).then((data: Object) => {
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
.blog-title {
    color: #1677ff;
}
</style>
