<template>
    ztree
    <div class="ztree" id="treeDemo1"></div>
    <div class="ztree" id="treeDemo2"></div>
    <div class="ztree" id="treeDemo3"></div>
</template>
<script lang="ts" setup>
import { ref, defineProps, onMounted, nextTick } from "vue";

const props = defineProps({
    type : {
        type : String,  //普通、复选(check)、单选(radio)
        required: false
    },
    setting : {
        type : Object,
        required: true
    },
    zNodes : {
        type : Array,
        required: true
    }
});

const initZtree = () => {

    // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
    var setting = {
        view: {
			showLine: true
		}
    };
    // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
    var zNodes = [{
        name: "test1",
        children: [{
            name: "test1_1"
        }, {
            name: "test1_2"
        }]
    },
    {
        name: "test2",
        children: [{
            name: "test2_1"
        }, {
            name: "test2_2"
        }]
    }];

    // @ts-ignore
    const $ = window.$;

    $.fn.zTree.init($("#treeDemo1"), setting, zNodes);

    //复选框
    function onCheck(event: MouseEvent, treeId: number, treeNode: any) {
        console.info(treeNode);
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        var nodes = treeObj.getCheckedNodes(true);
        console.info(nodes);
    }

    //选中
    function onClick(event: MouseEvent, treeId: number, treeNode: any) {
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        treeNode.checked = true;
        treeObj.updateNode(treeNode);
    }

    const setting2 = {
        check: {
            enable: true,
            chkStyle: "checkbox",
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onCheck: onCheck
        }
    };

    const zNodes2 = [
        { id: 1, pId: 0, name: "随意勾选 1", open: true },
        { id: 11, pId: 1, name: "随意勾选 1-1", open: true },
        { id: 111, pId: 11, name: "随意勾选 1-1-1" },
        { id: 112, pId: 11, name: "随意勾选 1-1-2" },
        { id: 12, pId: 1, name: "随意勾选 1-2", open: true },
        { id: 121, pId: 12, name: "随意勾选 1-2-1" },
        { id: 122, pId: 12, name: "随意勾选 1-2-2" },
        { id: 2, pId: 0, name: "随意勾选 2", checked: true, open: true },
        { id: 21, pId: 2, name: "随意勾选 2-1" },
        { id: 22, pId: 2, name: "随意勾选 2-2", open: true },
        { id: 221, pId: 22, name: "随意勾选 2-2-1", checked: true },
        { id: 222, pId: 22, name: "随意勾选 2-2-2" },
        { id: 23, pId: 2, name: "随意勾选 2-3" }
    ];

    $.fn.zTree.init($("#treeDemo2"), setting2, zNodes2);

    //单选框
    var setting3 = {
        check: {
            enable: true,
            chkStyle: "radio",
            radioType: "all"
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onCheck: onCheck,
            onClick: onClick
        }
    };

    $.fn.zTree.init($("#treeDemo3"), setting3, zNodes2);
}
// 挂载事件
onMounted(async () => {
    // 使用 $nextTick 确保 DOM 已经渲染完成
    await nextTick(() => {
        initZtree();
    });
});
</script>
<style scoped></style>