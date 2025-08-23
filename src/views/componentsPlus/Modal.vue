<template>
    <!--
    :style="{ ...(props.width ? { width: `${props.width}px` } : {}) }"
        :bodyStyle="{ ...(props.height ? { height: `calc(100% - 120px)`, overflow: 'auto' } : {}) }"
    -->
    <a-modal class="a-modal-win" v-model:open="open" :wrap-style="{ overflow: 'hidden' }" @cancel="handleClickCancel"
        :style="{ ...(props.width ? { width: `${props.width}px` } : {}) }" @ok="handleClickOK"
        :okButtonProps="{ style: { display: props.modalStatus === 'view' ? 'none' : 'inline-block' } }"
        :maskClosable="maskClosable">
        <template #title>
            <div ref="modalTitleRef" style="width: 100%; cursor: move; display: flex; align-items: center;">
                <PlusOutlined v-if="(props.modalStatus || '').includes('add')" style="margin-right: 8px;" />
                <EditOutlined v-else-if="(props.modalStatus || '').includes('edit')" style="margin-right: 8px;" />
                <EyeOutlined v-else-if="(props.modalStatus || '').includes('view')" style="margin-right: 8px;" />
                <span>{{ props.modalTitle || '' }}</span>
            </div>
        </template>
        <div class="diy-form">
            <slot name="form">表单内容</slot>
        </div>
        <template #modalRender="{ originVNode }">
            <component :is="originVNode" />
            <!-- <div :style="transformStyle"> -->

            <!-- </div> -->
        </template>
    </a-modal>
</template>
<script lang="ts" setup>
// 模态对话框
import { useAttrs, useSlots, ref, defineModel, watch } from 'vue';
import { PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons-vue';
const attrs = useAttrs();
const slots = useSlots();
// console.log(`modal透传对象`, attrs);
// console.log(`modal透传插槽`, slots);

// 接收父层传递对象
const props = defineProps({
    modalTitle: {
        type: String,
        required: false
    },
    modalStatus: {
        type: String,
        required: false
    },
    width: {
        type: Number,
        required: false
    },
    height: {
        type: Number,
        required: false
    },
    handleOk: {
        type: Function,
        required: false
    },
    handleCancel: {
        type: Function,
        required: false
    },
    okButtonProps: {
        type: Object,
        required: false
    }
});

const isMaskClosable = () => {
    if (attrs.maskClosable !== undefined) {
        return attrs.maskClosable;
    } else {
        if (attrs.modalStatus !== undefined) {
            if (props.modalStatus === 'view') {
                return true;
            }
            return false;
        }
    }
    return true;
}
watch(() => props.modalStatus, (newVal) => {
    maskClosable.value = isMaskClosable();
});
const open = defineModel("open");
const modalTitleRef = ref<HTMLElement>();
const maskClosable = ref(isMaskClosable());

// 按钮确定被点击
function handleClickOK(e: MouseEvent) {
    if (props.handleOk) {
        // 如果 handleOk 返回 false，则不关闭模态框
        return props.handleOk(e);
    } else {
        defaultHandleOk(e);
    }
};

const defaultHandleOk = (e: MouseEvent) => {
    open.value = false;
};

// 按钮取消被点击
function handleClickCancel(e: MouseEvent) {
    if (props.handleCancel) {
        props.handleCancel(e);
    } else {
        defaultHandleCancel(e);
    }
};

const defaultHandleCancel = (e: MouseEvent) => {
    open.value = false;
};

</script>
<style>
.a-modal-win .ant-modal {
    top: 50% !important;
    transform: translateY(-50%) !important;
    margin: 0 auto !important;
}

/* 覆盖 Ant Design Vue 的默认样式，解决开发环境中的 CSS 变量前缀问题 */
.a-modal-win[class*="ant-modal"] {
    top: 50% !important;
    transform: translateY(-50%) !important;
    margin: 0 auto !important;
    max-height: calc(100vh - 32px) !important;
}

:where(.ant-modal) {
    top: 50% !important;
    transform: translateY(-50%) !important;
    margin: 0 auto !important;
}

.a-modal-win .ant-modal-header {
    margin-bottom: 20px;
    padding: 10px 0px 10px 0px;
    border-bottom: 1px solid #eee;
}

.a-modal-win .ant-modal-body {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
}

.a-modal-win .diy-form {
    height: 100%;
}
</style>
