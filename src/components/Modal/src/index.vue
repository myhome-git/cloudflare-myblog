<template>
  <!--
    :style="{ ...(props.width ? { width: `${props.width}px` } : {}) }"
        :bodyStyle="{ ...(props.height ? { height: `calc(100% - 120px)`, overflow: 'auto' } : {}) }"
    -->
  <a-modal
    v-model:open="open"
    class="a-modal-win"
    :closable="false"
    :destroy-on-close="true"
    :wrap-class-name="fullscreen?'full-modal':''"
    :wrap-style="{ overflow: 'hidden' }"
    :style="{ 
      ...(props.width ? { width: `${props.width}px` } : {})
    }"
    :confirm-loading="confirmLoading"
    :ok-text="props.okText"
    :ok-button-props="okButtonProps"
    :cancel-text="props.cancelText"
    :cancel-button-props="cancelButtonProps"
    :mask-closable="maskClosable"
    @ok="onClickOK"
    @cancel="onClickCancel"
  >
    <template #title>
      <div ref="modalTitleRef" style="width: 100%; cursor: move; display: flex; align-items: center;">
        <slot name="title">
          <PlusOutlined v-if="(props.status || '').includes('add')" style="margin-right: 8px;" />
          <EditOutlined v-else-if="(props.status || '').includes('edit')" style="margin-right: 8px;" />
          <EyeOutlined v-else-if="(props.status || '').includes('view')" style="margin-right: 8px;" />
          <span>{{ props.title || '' }}</span>
          <div class="title-button">
            <a-button
              v-if="props.fullscreen"
              type="text"
              danger
              @click="handleClickFullscreen"
            >
              <FullscreenOutlined />
            </a-button>
            <a-button type="text" danger @click="onClickCancel">
              <CloseOutlined />
            </a-button>
          </div>
        </slot>
      </div>
    </template>
    <div class="diy-form" :style="{height:`${props.height}px`}">
      <slot name="default">
        表单内容
      </slot>
    </div>
    <template #modalRender="{ originVNode }">
      <component :is="originVNode" />
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
// 模态对话框
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { PlusOutlined, EditOutlined, EyeOutlined, CloseOutlined, FullscreenOutlined } from '@ant-design/icons-vue'
// @ts-ignore
import Draggable from 'draggable'
import { toObject } from '@/utils/utils';

// const attrs = useAttrs();
// const slots = useSlots();
// console.log(`modal透传对象`, attrs);
// console.log(`modal透传插槽`, slots);

// 接收父层传递对象
const props = defineProps({
    title: {
        type: [String, Function],
        required: false,
        default: '提示'
    },
    status: {
        type: String,
        required: true
    },
    maskClosable: {
        type: Boolean,
        required: false
    },
    fullscreen: {
        type: Boolean,
        required: false,
        default: false
    },
    width: {
        type: Number,
        required: false
    },
    height: {
        type: Number,
        required: false
    },
    visible: {
        type: [Boolean, Function],
        required: false,
        default: true
    },
    disabled: {
        type: [Boolean, Function],
        required: false,
        default: false
    },
    handleClickOK: {
        type: Function,
        required: false
    },
    handleClickCancel: {
        type: Function,
        required: false
    },
    okButtonProps: {
        type: Object,
        required: false,
        default: () => ({})
    },
    cancelButtonProps: {
        type: Object,
        required: false,
        default: () => ({})
    },
    cancelText: {
      type: [String, Function],
      required: false,
      default: '取消'
    },
    okText: {
      type: [String, Function],
      required: false,
      default: '确定'
    }
});

const okButtonProps = computed(() => {
  let display = 'inline-block'
  if(toObject(props.visible) === false){
    display = 'none'
  }else if(props.status === 'view'){
    display = 'none'
  }
  return Object.assign({}, props.okButtonProps, {
    style: {
      display
    },
    disabled: toObject(props.disabled)
  })
})
const cancelButtonProps = computed(() => {
  let display = 'inline-block'
  if(toObject(props.visible) === false){
    display = 'none'
  }else if(props.status === 'view'){
    display = 'none'
  }
  return Object.assign({}, props.okButtonProps, {
    style: {
      display
    },
    disabled: toObject(props.disabled)
  })
})

const open = defineModel("open")
const fullscreen = ref(props.fullscreen)
const maskClosable = computed(() => {
    if (props.maskClosable !== undefined) {
        return props.maskClosable
    } else {
        if (props.status === 'view') {
            return true
        }
    }
    return false
})

// 按钮确定被点击
const confirmLoading = ref(false)
async function onClickOK(e: MouseEvent) {
  // 代理点击确认回调，统一处理同步/异步错误
  const proxyClickOK = async (e: any) => {
    if (!props.handleClickOK) {
      return undefined
    }
    try {
      // 同步和异步错误都能被捕获
      return await Promise.resolve(props.handleClickOK(e))
    } catch {
      // console.error('handleClickOK 执行出错:', error)
      // 返回错误标识，让上层知道执行失败，不关闭弹窗
      return false
    }
  }
  if (props.handleClickOK) {
    confirmLoading.value = true
    try {
      const result = await proxyClickOK(e)
      // 如果返回 false，则不关闭模态框
      if (result !== false) {
        defaultHandleCancel(e)
      }
      return result
    } finally {
      confirmLoading.value = false
    }
  } else {
    return defaultHandleCancel(e)
  }
};

// 按钮取消被点击
async function onClickCancel(e: MouseEvent) {
    if (props.handleClickCancel) {
    const result = await props.handleClickCancel(e)
    // 如果返回 false，则不关闭模态框
    if (result !== false) {
        defaultHandleCancel(e)
    }
    return result
  } else {
    return defaultHandleCancel(e)
  }
};
function handleClickFullscreen(){
  fullscreen.value = !fullscreen.value
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultHandleCancel = (e: MouseEvent) => {
    open.value = false
};

// 拖动
const modalTitleRef = ref<HTMLElement | null>(null)
const draggableInited = ref(false)
let dragInstance: any = null

// 鼠标按下事件处理
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handleMouseDown(e: MouseEvent) {
  if (!draggableInited.value) {
    const ele = document.querySelector('.ant-modal-wrap');
    if (ele) {
      dragInstance = new Draggable(ele, {
        // 拖拽handle设置为Modal头部
        handle: document.querySelector('.ant-modal-header')
      })
      draggableInited.value = true
    }
  }
  
  // 绑定鼠标松开事件到 document，确保在任意位置松开都能触发
  document.addEventListener('mouseup', handleMouseUp)
}

// 鼠标松开事件处理
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handleMouseUp(e: MouseEvent) {
  // 解绑鼠标松开事件
  document.removeEventListener('mouseup', handleMouseUp)
  
  // 如果需要在松开时做其他处理，可以在这里添加
}

onMounted(() => {
  nextTick(() => {
    // 确保DOM已渲染完成后获取元素引用
    if (modalTitleRef.value) {
      // 绑定鼠标按下事件
      modalTitleRef.value.addEventListener('mousedown', handleMouseDown)
    }
  })
})

// 组件卸载时清理事件监听器
onUnmounted(() => {
  if (modalTitleRef.value) {
    modalTitleRef.value.removeEventListener('mousedown', handleMouseDown)
  }
  if (dragInstance) {
    dragInstance.destroy()
  }
})

</script>
<style lang="less">
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
    max-height: 100vh;
}
.a-modal-win .title-button{
  position: absolute;
  right: 0;
  top: 0;
}
.a-modal-win .title-button button{
  padding: 4px 8px;
}
:where(.ant-modal) {
    top: 50% !important;
    transform: translateY(-50%) !important;
    margin: 0 auto !important;
}
.a-modal-win .ant-modal-header{
  position: relative;
  margin-bottom: 10px !important;
  /* outline: 1px solid red; */
}
.a-modal-win .ant-modal-header .ant-modal-title > div{
  /* outline: 1px solid blue; */
   padding: 10px 0px 10px 0px;
}
.a-modal-win .ant-modal-header::after {
    display: block;
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-bottom: 1px solid #eee;
}

.a-modal-win .ant-modal-body {
    min-height: 30px;
    overflow-y: auto;
    max-height: calc(100vh - 140px);
}

.a-modal-win .diy-form {
    height: 100%;
}
.full-modal {
  .ant-modal {
    max-width: calc(100vw);
    min-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
    padding: 10px 24px;
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>
