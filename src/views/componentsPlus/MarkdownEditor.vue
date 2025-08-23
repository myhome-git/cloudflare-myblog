<template>
    <div class="markdown-container" :style="{ height: props.height ? props.height.toString() : '100%' }">
        <div ref="refMarkdown" class="ref-markdown" :id="uuid" style="height: 100%"></div>
    </div>
</template>

<script lang="ts" setup>
import { useAttrs, useSlots, ref, watch, defineProps, onMounted, onUnmounted, nextTick } from 'vue'
import 'cherry-markdown/dist/cherry-markdown.css';
import Cherry from 'cherry-markdown';
import { createUUID } from "@/utils/utils";

// 透传对象属性和方法
const attrs = useAttrs();
const slots = useSlots();
// console.log(`markdown透传对象`, attrs);
// console.log(`markdown透传插槽`, slots);

const props = defineProps({
    type: {
        type: String,
        default: 'edit&preview'
    },
    value: {
        type: String,
        default: ''
    },
    height: {
        type: String,
        default: '100%'
    }
})

const markdownValue = ref(props.value);
watch(() => props.value, (newValue) => {
    // console.error(`props.value`, newValue.length);
    markdownValue.value = newValue;
    setValue(newValue);
})

// 监听 props.type 的变化
watch(() => props.type, (newType) => {
    if (cherryObj) {
        const newModel = getMarkdownModel(newType);
        // 更新编辑器模式
        // cherryObj.setEditorMode(newModel);
        cherryObj?.switchModel(newModel);
    }
})

const uuid = `markdown-${createUUID()}`;
let markdownModel = '';
const getMarkdownModel = (type: string) => {
    switch (type) {
        case "view":
            return 'previewOnly';
        default:
            return 'edit&preview';
    }
};
markdownModel = getMarkdownModel(props.type);

let cherryObj: any = null, isInit = false;
const onMarkdownInit = () => {
    cherryObj = new Cherry({
        id: uuid,
        editor: {
            // @ts-ignore
            defaultModel: markdownModel.toString(), // 默认模式：双栏编辑预览模式
        },
        // 设置编辑器高度
        height: props.height,
        // @ts-ignore
        themeSettings: {
            // 主题列表，用于切换主题
            themeList: [
                { className: 'default', label: '默认' },
                { className: 'dark', label: '黑' },
                { className: 'light', label: '白' },
                { className: 'green', label: '绿' },
                { className: 'red', label: '粉' },
                { className: 'violet', label: '紫' },
                { className: 'blue', label: '蓝' },
            ],
            // 目前应用的主题
            mainTheme: 'light',
            // 目前应用的代码块主题
            codeBlockTheme: 'default',
        },
    });
    cherryObj.on("error", (err: any) => {
        // console.error(`${uuid}，markdown渲染错误`, err);
    });
    cherryObj.on("afterAsyncRender", () => {
        // console.log(`${uuid}，markdown渲染完成`);
        onAfterAsyncRender();
    })
    cherryObj.on("afterChange", (text: string, html: string) => {
        // console.log(`${uuid}，markdown afterChange`);
        onAfterChange();
    })
    cherryObj.on("afterInit", (text: string, html: string) => {
        // Note: This event might not fire if it's triggered synchronously during initialization
        // before the event handlers are registered. This is a common issue with event-driven systems.
        // console.log(`${uuid}，markdown初始化完成`);
        onAfterAsyncRender();
    })
    cherryObj.setValue(markdownValue.value || '');
}
const onAfterChange = () => {
    if (attrs.onAfterChange) {
        // @ts-ignore
        attrs.onAfterChange(cherryObj);
    }
}
const onAfterAsyncRender = () => {
    // console.log(`${uuid}回调函数被调用`);
    if (attrs.onAfterAsyncRender) {
        // @ts-ignore
        attrs.onAfterAsyncRender(cherryObj);
    }
}

// 获取初始化后的对象
const getObj = () => {
    return cherryObj.getCodeMirror();
}
const getUUID = () => {
    return uuid;
}

// 设置内容
const setValue = (value: string) => {
    if (cherryObj) {
        cherryObj?.setMarkdown(value);
    } else {
        setTimeout(() => {
            setValue(value);
        }, 200)
    }
}
const getValue = () => {
    return cherryObj?.getMarkdown();
}
const clearValue = () => {
    setValue("");
}
const getHtml = () => {
    return cherryObj?.getHtml();
}
const getPreviewer = () => {
    return cherryObj?.getPreviewer();
}

// 文件导出
const exportToFile = (type: string) => {
    switch (type) {
        case "pdf":
            cherryObj?.export();
            break;
        case "img":
            cherryObj?.export("img");
            break;
        default:
            break;
    }
}

const destroy = () => {
    cherryObj?.destroy();
}

// 挂载事件
onMounted(async function () {
    // 使用 $nextTick 确保 DOM 已经渲染完成
    await nextTick(() => {
        // console.log(`${uuid}，组件被挂载`);
        onMarkdownInit();
    });
});
onUnmounted(() => {
    // console.log(`${uuid}，组件被销毁`);
    destroy();
});

// 暴露给父组件的方法
defineExpose({ getObj, getUUID, setValue, getValue, clearValue, getHtml, getPreviewer, exportToFile });
</script>
<style scoped>
.markdown-container {
    height: 100%;
    position: relative;
}
:deep(.cherry){
    min-height: 500px !important;
}

:deep(.cherry-markdown){
    min-height: 500px !important;
}
</style>
