<template>
    <a-page-header size="small" style="border: 1px solid rgb(235, 237, 240);padding:12px 24px;" :breadcrumb="{ routes }"
        @click.prevent />
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue';

// 获取路由对象
const newRouter = useRouter();
const routesOptions = newRouter?.options?.routes;

let routes = ref([]);
newRouter.beforeEach((to, from, next) => {
    routes.value = <any>formatRouterListToNav(to.path);
    next();
});

/**
 * 格式化为数组
 * @param path 
 */
function formatRouterListToNav(path: String) {
    let list = generateSubstrings(path);
    let newList = <any>[];
    list.forEach(element => {
        const node = findNodeById(routesOptions, element);
        if (node) {
            newList.unshift({
                path: extractStrings(element),
                breadcrumbName: node.__name,
            });
        }
    });
    return newList;
}

/**
 * 对路径进行递归，例如：/1/2/3、/1/2、/1
 * @param str 
 */
const generateSubstrings = (str: String) => {
    const substrings = [];
    let currentString = str;
    while (currentString) {
        substrings.push(currentString);
        const lastIndex = currentString.lastIndexOf('/'); // 找到最后一个斜杠
        if (lastIndex === -1) {
            break; // 如果没有斜杠，停止循环
        }
        currentString = currentString.substring(0, lastIndex); // 截取到最后一个斜杠之前
    }
    return substrings;
};

/**
 * 取出最后的字符串
 * @param inputString 
 */
function extractStrings(inputString: String) {
    // 使用 split 方法将字符串分割成数组，以 "/" 为分隔符
    const parts = inputString.split("/");

    // 过滤掉空字符串（由于字符串以 "/" 开头，所以第一个元素是空字符串）
    const filteredParts = parts.filter(part => part !== "");
    return filteredParts[filteredParts.length - 1];
}

/**
 * 递归查找节点
 * @param tree 
 * @param targetId 
 */
const findNodeById: any = (tree: any, targetId: String) => {
    for (const node of tree) {
        if (node.path === targetId) {
            return node;
        }
        if (node.children) {
            const found = findNodeById(node.children, targetId);
            if (found) {
                return found;
            }
        }
    }
    return null; // 如果没找到，返回 null
};

</script>
<style scoped></style>
