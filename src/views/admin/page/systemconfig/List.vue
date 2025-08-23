<template>
    <a-collapse activeKey="1" :accordion="false" :bordered="true" ghost>
        <a-collapse-panel key="1" :showArrow="false">
            <template #header>
                <a-alert message="cloudflare 额度" type="info" />
            </template>
            <a-list item-layout="horizontal" :data-source="dataSource" size="small">
                <template #renderItem="{ item }">
                    <a-list-item>
                        <a-list-item-meta>
                            <template #title>
                                {{ item.title }}
                            </template>
                            <template #description>{{ item.remarks }}</template>                            
                        </a-list-item-meta>
                    </a-list-item>
                </template>
            </a-list>
        </a-collapse-panel>
        <a-collapse-panel key="1" header="This is panel header 2" :showArrow="false">
            <p>123</p>
        </a-collapse-panel>
    </a-collapse>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import { message } from "ant-design-vue";
// @ts-ignore
import SystemConfig from "@/SystemConfig.js";
// @ts-ignore
import request from "@/utils/request.js";
import { isValidValue, getKey, encodeString, decodeString } from "@/utils/utils.js";
import Modal from "@/views/componentsPlus/Modal.vue";

/**
 * table模块
 */
// @ts-ignore
import tableConf from "./table.conf.js";
const { apiURL, uuidName, tableColumns } = tableConf;
interface DataItem {
    title: string;
    remarks: string;
    content: {
        read: number;
        put: number;
        delete: number;
    },
    contentUsed: {
        read: number;
        put: number;
        delete: number;
    };
}
const dataSource = ref(<DataItem[]>[]);
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


/**
 * from表单
 */
interface FormState { }
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
    let requestParams = {};
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
    }).catch((err: any) => {
        requestTiming = err.requestTiming;
    }).finally(() => {
        setTimeout(() => {
            tableSpinning.value = false;
            requestTiming.isError ? tableLocaleEmptyText.value = requestTiming.message : null;
        }, requestTiming?.delayAdded);
    });
}

// 挂在事件
onMounted(async () => {
    // 使用 $nextTick 确保 DOM 已经渲染完成
    await nextTick(() => {
        // handleGetList();
    });
});
</script>
<style scoped>
:deep(.ant-collapse-header) {
    padding: 0 !important;
}

:deep(.ant-collapse) {
    border-radius: 0 !important;
}

:deep(.ant-alert) {
    border-radius: 0 !important;
    border: 0 !important;
}

:deep(.ant-alert-message) {
    font-size: 16px !important;
    font-weight: 500 !important;
    padding: 0px 16px !important;
}
</style>
