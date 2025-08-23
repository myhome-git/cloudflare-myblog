<template>
    <div ref="$ztreeContainer" class="ztree" :id="treeId"></div>
</template>
<script lang="ts" setup>
import { ref, defineProps, watch, onMounted, onUnmounted, nextTick, reactive, defineEmits } from "vue";
import { merge } from 'lodash';

const props = defineProps({
    treeUUID: String,
    type: {
        type: String,  //普通、复选(checkbox)、单选(radio)
        required: false,
        default: "read"
    },
    treeSetting: { //zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
        type: Object,
        required: false
    },
    treeNodes: {  //zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
        type: Array,
        required: false,
        default: []
    }
});

const emit = defineEmits(["onExpand", "onClick", "onCheck", "onDestroy", "onDrop"]);
const treeId = props.treeUUID;
const setting = ref(props.treeSetting);
const zNodes = ref(props.treeNodes);    // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
const $ztreeContainer = ref(null);
// @ts-ignore
$ztreeContainer.extendMethods = {}; // 扩展自身方法

watch([props.treeNodes], (newValue, oldValue) => {
    handleTreeAddNodeData(JSON.parse(JSON.stringify(newValue[0])));
});

const getJQuery = () => {
    // @ts-ignore
    return window.$;
}


const getZTreeObj = () => {
    // @ts-ignore
    return $ztreeContainer.value.ztree;
}

/**
 * 特殊方法，用于jquery插件的初始化
 */
const initComponent = () => {

    const $ = getJQuery();

    function onExpand(event: MouseEvent, treeId: any, treeNode: any) {
        emit("onExpand", event, treeNode);
    };

    // 复选框，用于捕获 checkbox / radio 被勾选 或 取消勾选的事件回调函数
    function onCheck(event: MouseEvent, treeId: number, treeNode: any) {
        // console.log(`触发${event.type}事件，操作的节点`, treeNode);
        const treeObj = getZTreeObj();
        if (!treeObj) return;
        // 如果是复选框则不进行选中操作
        if (props.type === "checkbox") {

        } else {
            treeObj.selectNode(treeNode);
        }
        const nodes = treeObj.getCheckedNodes(true);
        // console.info(`被勾选的节点`, nodes);
        emit("onCheck", treeNode, nodes);
    }

    // 用于捕获节点被点击的事件回调函数，如果设置了 setting.callback.beforeClick 方法，且返回 false，将无法触发 onClick 事件回调函数。
    function onClick(event: MouseEvent, treeId: number, treeNode: any) {
        event.stopPropagation();
        // 如果type为复选框，则由复选框触发
        // 由于双击两次间隔太短
        // console.log(`触发${event.type}事件，操作的节点`, treeNode);
        const treeObj = getZTreeObj();
        if (!treeObj) return;
        if (props.type === "checkbox") {
            return;
        } else {
            treeObj.selectNode(treeNode);
        }

        treeNode.checked = true;
        treeObj.updateNode(treeNode);
        emit("onClick",event, treeNode);
    }

    function onDblClick(event, treeId, treeNode) {
        // console.log(`触发${event.type}事件，操作的节点`, treeNode);
        event.stopPropagation();
    }

    function onBeforeDblClick(treeId, treeNode) {
        return false;
    };

    // 节点被拖拽之前的事件回调函数，并且根据返回值确定是否允许开启拖拽操作
    function beforeDrag(treeId: any, treeNodes: any) {
        for (var i = 0, l = treeNodes.length; i < l; i++) {
            if (treeNodes[i].drag === false) {
                return false;
            }
        }
        return true;
    }

    // 节点拖拽操作结束之前的事件回调函数，并且根据返回值确定是否允许此拖拽操作
    function beforeDrop(treeId: any, treeNodes: any, targetNode: any, moveType: any) {
        return targetNode ? targetNode.drop !== false : true;
    }

    // 节点拖拽操作结束的事件回调函数，treeNodes被拖拽的节点 JSON 数据集合
    function onDrop(event: any, treeId: any, treeNodes: any, targetNode: any, moveType: any) {
        emit("onDrop", treeNodes, targetNode);
    };

    // 默认配置
    const settingDefault = {
        view: {
            showLine: true
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: onClick,
            onExpand: onExpand,
            onDblClick: onDblClick,
            beforeDblClick: onBeforeDblClick
        }
    };

    // 拖拽操作配置
    const settingDefaultEdit = {
        edit: {
            enable: false,
            showRemoveBtn: false,
            showRenameBtn: false
        },
        drag: {
            isCopy: false, // 允许复制节点
            isMove: true, // 允许移动节点
            prev: false, // 允许拖拽到目标节点前
            next: false, // 允许拖拽到目标节点后
            inner: true // 允许拖拽成为目标节点的子节点
        },
        callback: {
            beforeDrag: beforeDrag,
            beforeDrop: beforeDrop,
            onDrop: onDrop
        }
    }

    merge(settingDefault, settingDefaultEdit);


    // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
    const setting1 = {};

    //单选框
    const setting2 = {
        view: {
            selectedMulti: false
        },
        check: {
            enable: true,
            chkStyle: "radio",
            radioType: "all",
            //设置自动关联勾选时是否触发 beforeCheck / onCheck 事件回调函数。
            //[setting.check.enable = true 且 setting.check.chkStyle = "checkbox" 时生效]
            autoCheckTrigger: false,
        },
        callback: {
            onCheck: onCheck
        }
    };

    // 复选框
    const setting3 = {
        check: {
            enable: true,
            chkStyle: "checkbox",
            //设置自动关联勾选时是否触发 beforeCheck / onCheck 事件回调函数。
            //[setting.check.enable = true 且 setting.check.chkStyle = "checkbox" 时生效]
            autoCheckTrigger: false,
        },
        callback: {
            onCheck: onCheck
        }
    };

    const config = props;
    let newSetting = {};
    merge(settingDefault, setting.value);
    switch (config.type) {
        case "read":
            merge(setting1, settingDefault);
            merge(newSetting, setting1);
            break;
        case "radio":
            merge(setting2, settingDefault);
            merge(newSetting, setting2);
            break;
        case "checkbox":
            merge(setting3, settingDefault);
            merge(newSetting, setting3);
            break;
        default:
            break;
    }
    // console.log(`ztree ${config.type} setting：`, newSetting);
    // @ts-ignore
    $ztreeContainer.value.ztree = $.fn.zTree.init($(`#${treeId}`), newSetting, zNodes.value);
}

// 添加节点
const handleTreeAddNodeData = (nodes: Array<any>) => {
    const treeObj = getZTreeObj();
    if (!treeObj) return;
    nodes.forEach((element) => {
        const treeNode = treeObj.getNodeByParam("id", element.id, null);
        // 判断自身是否存在
        if (!treeNode) {
            //查找父层节点
            const parentNode = treeObj.getNodeByParam("id", element.pId, null);
            treeObj.addNodes(parentNode, [element]);
        }
    });
}

// 更新节点
const handleTreeNodeUpdate = (array: Array<Object>) => {
    const treeObj = getZTreeObj();
    if (!treeObj) return;
    // 允许更改的值
    const coms = ["name", "pId"];
    array.forEach((obj: any) => {
        const treeNode = treeObj.getNodeByParam("id", obj.id, null);
        if (treeNode) {
            coms.forEach((key) => {
                treeNode[key] = obj[key];
            });
            treeObj.updateNode(treeNode);
        }
    });
}

// 删除节点
const handleTreeNodeRemove = (ids: Array<String>) => {
    const treeObj = getZTreeObj();
    if (!treeObj) return;
    ids.forEach((key: any) => {
        const treeNode = treeObj.getNodeByParam("id", key, null);
        if (treeNode) {
            treeObj.removeNode(treeNode);
        }
    });
}

/**
 * 销毁组件
 */
const destroyComponent = () => {
    const $ = getJQuery();
    $.fn.zTree.destroy(`#${treeId}`);
}

/**
 * 挂载事件
 */
onMounted(async () => {
    // 使用 $nextTick 确保 DOM 已经渲染完成
    // console.log(`组件被装载`);
    await nextTick(() => {
        initComponent();
    });
});

onUnmounted(() => {
    // console.log(`组件被销毁`);
    emit("onDestroy");
    destroyComponent();
});

// 暴露给父组件的方法
defineExpose({ handleTreeNodeUpdate, handleTreeNodeRemove });
</script>
<style scoped></style>