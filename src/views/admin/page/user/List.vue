<template>
    <Modal v-model:open="modalOpen" :modalStatus="modalStatus" :modalTitle="modalTitle" :handleOk="handleOk"
        :handleCancel="handleCancel">
        <template v-slot:form>
            <a-form :model="formState" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
                autocomplete="off">
                <a-form-item label="登陆账户：" name="username" :rules="[{ required: true, message: '请输入登陆账户' }]">
                    <a-input v-model:value="formState.username" />
                </a-form-item>
                <a-form-item label="登陆密码：" name="password" :rules="[{ required: false, message: '请输入登陆密码' }]">
                    <a-input v-model:value="formState.password" />
                    <template v-if="modalStatus === 'edit'">
                        <p class="tishi-info">1、密码为空，则不进行修改</p>
                        <p class="tishi-info">2、需要修改只需要输入新密码，输入示例：123456</p>
                    </template>
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
import { isValidValue, getKey, encodeString, decodeString } from "@/utils/utils.js";
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
        rowData.password = "";
        resetFormValue();
        setFormValue(rowData);
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
const pagination = ref(SystemConfig.page);

/**
 * 模态对话框
 */
const modalOpen = ref<Boolean>(false);
const modalWidth = ref(`${Math.max(600, 0)}px`);
const modalHeight = ref(`${Math.max(600, 0)}px`);
const modalStatus = ref("");
const modalTitle = ref("");
const showModal = (value: boolean = true) => {
    modalOpen.value = value === undefined ? true : value;
};
const handleOk = (e: MouseEvent) => {
    const value = modalStatus.value;
    if (value === "add") {
        handleAdd();
    } else if (value === "edit") {
        handleEdit();
    }
};
const handleCancel = () => {

}

/**
 * from表单
 */
interface FormState {
    username: string;
    password: string;
}
const formStateDefaultValue = <FormState>{
    username: "",
    password: ""
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
    if (!sendForm.username) {
        message.error("缺少必填项");
        return false;
    }
    request({
        url: `${apiURL}`,
        method: "post",
        data: sendForm
    }).then((data: Object) => {
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
    }).then((data: Object) => {
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
.tishi-info {
    margin-bottom: 4px;
}
</style>