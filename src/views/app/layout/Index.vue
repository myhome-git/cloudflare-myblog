<template>
    <div class="app-win">
        <link rel="stylesheet" href="//at.alicdn.com/t/font_1281105_ue0q9rvh0lb.css">
        <div class="x-container">
            <Header @on-search="onSearch"></Header>
        </div>
        <div class="x-layout layout-nav">
            <div class="x-container">
                <Nav :dataSource="dataSourceNav"></Nav>
            </div>
        </div>
        <div class="x-container flex-auto">
            <div class="layout-content">
                <Content>
                    <template #left>
                        <RouterView></RouterView>
                    </template>
                    <template #right>
                        <Hot :dataSource="dataSourceHot"></Hot>
                        <div style="height: 14px;"></div>
                        <Link :dataSource="dataSourceLink"></Link>
                    </template>
                </Content>
            </div>
        </div>
        <div class="x-layout layout-footer">
            <div class="x-container">
                <Footer></Footer>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { RouterView } from 'vue-router';
import { ref, onMounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { isValidValue, handleDecodemultiple, handleItemClick } from "@/utils/utils.js";
import request from "@/utils/request";
import '../assets/css/common.css';
import Header from './Header.vue';
import Nav from './Nav.vue';
import Content from './Content.vue';
import Footer from './Footer.vue';
import Hot from '../page/Hot.vue';
import Link from '../page/Link.vue';

const route = useRoute();
const router = useRouter();

// 搜索
const inputSearchValue = ref("");
const onSearch = (value: string) => {
    inputSearchValue.value = value;
    handleItemClick({ searchText: value }, '/app', router, false)
}

// 数据源
const apiURL = `/api/app/blogs/query`;
const dataSourceHot = ref([]);
const handleGetListHot = () => {
    let requestParams = Object.assign({}, {
        size: 10,
        index: 1,
        total: 0
    });
    Object.assign(requestParams, {
        searchText: isValidValue(inputSearchValue.value) ? inputSearchValue.value : null,
        classId: isValidValue(inputSearchValue.value) ? null : (isValidValue(route.query.classId) ? route.query.classId : null)
    });
    request({
        url: `${apiURL}/getBlogClassHot`,
        params: requestParams
    }).then((data: any) => {
        const result = data.result;
        const value = dataSourceHot.value;
        value.splice(0, value.length);
        result.forEach((element: any, index: number) => {
            if (index === 0) {
                element.color = "pink";
            } else if (index === 1) {
                element.color = "orange";
            } else if (index === 2) {
                element.color = "green";
            } else {
                element.color = "default";
            }
            // @ts-ignore
            element = handleDecodemultiple(element, element.key, ["title"]);
            // @ts-ignore
            value.push(element);
        });
    }).catch((err: any) => {
        console.log(err);
    });
};
const dataSourceLink = ref([]);
const handleGetListLink = () => {
    let requestParams = Object.assign({}, {
        size: 10,
        index: 1,
        total: 0
    });
    Object.assign(requestParams, {
        searchText: isValidValue(inputSearchValue.value) ? inputSearchValue.value : null
    });
    request({
        url: `${apiURL}/getLink`,
        params: requestParams
    }).then((data: any) => {
        const result = data.result;
        const value = dataSourceLink.value;
        value.splice(0, value.length);
        result.forEach((element: any, index: number) => {
            if (index === 0) {
                element.color = "pink";
            } else if (index === 1) {
                element.color = "orange";
            } else if (index === 2) {
                element.color = "green";
            } else {
                element.color = "default";
            }
            // @ts-ignore
            value.push(element);
        });
    }).catch((err: any) => {
        console.log(err);
    });
};
const dataSourceNav = ref([]);
const handleGetListNav = () => {
    let requestParams = Object.assign({}, {
        size: 10,
        index: 1,
        total: 0
    });
    Object.assign(requestParams, {
        searchText: isValidValue(inputSearchValue.value) ? inputSearchValue.value : null
    });
    request({
        url: `/api/app/blogClass`,
        params: requestParams
    }).then((data: any) => {
        const result = data.result;
        const value = dataSourceNav.value;
        value.splice(0, value.length);
        result.forEach((element: any) => {
            // @ts-ignore
            value.push(element);
        });
    }).catch((err: any) => {
        console.log(err);
    });
};

// 挂载事件
onMounted(async () => {
    // 使用 $nextTick 确保 DOM 已经渲染完成
    await nextTick(() => {
        handleGetListHot();
        handleGetListLink();
        handleGetListNav();
    });
});

// 监听路由变化，重新获取所有数据
watch(route, () => {
    handleGetListHot();
});
</script>
<style scoped>
/* 这里可以添加样式，或者在全局样式中定义 */
.app-win {
    font-family: "Microsoft YaHei", "Helvetica Neue", "Hiragino Sans GB", "黑体", Arial, sans-serif;
	font-size: 13px;
	line-height: 1.5;
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    flex-direction: column;
    background-color: #fdfcf8;
    color: #999;
    overflow-y: scroll;
    overflow-x: auto;
}

.x-container {
    width: 1160px;
    margin: 0 auto;
    /* outline: 1px solid red; */
}

.x-container.flex-auto {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.x-container.flex-auto :deep(.app-content) {
    flex: 1;
}

.app-header {
    padding: 20px 0;
}

.layout-nav {
    background-color: #e8e7e3;
    color: #999;
    position: sticky;
    top: 0;
    z-index: 10;
    /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
}

.layout-footer {
    background-color: #e8e7e3;
    color: #999;
}

.layout-content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* 路由切换过渡动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
<style>
body{
    --app-win--bg-color-rgb: 200, 200, 200;
    --app-win--bg-color-opacity: 0.2;
    --app-win--border-color-rgb: 50, 50, 50;
    --app-win--border-color-opacity: 0.2;
}
.app-unit{
    /* background-color: rgba(var(--app-win--bg-color-rgb), var(--app-win--bg-color-opacity)); */
    border: 1px solid rgba(var(--app-win--border-color-rgb), var(--app-win--border-color-opacity));
    border-radius: 5px;
}
.app-unit::before{
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(255,255,255, 1);
    border-bottom-right-radius: inherit;
    border-bottom-left-radius: inherit;
    z-index: -1;
}
.app-unit.app-shadow{
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.app-unit .unit-title{
    line-height: 46px;
    height: 46px;
    padding: 0px 10px 0px 16px;
    position: relative;
    font-weight: bold;
    background-color: rgba(var(--app-win--bg-color-rgb), calc(var(--app-win--bg-color-opacity) + 0.1));
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
}
.app-unit .unit-title::after {
    content: '';
    display: block;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-bottom: 1px solid rgba(var(--app-win--border-color-rgb), calc(var(--app-win--border-color-opacity) - 0.1));
}

.app-unit .unit-title .t-value {
    float: left;
    font-size: 16px;
    color: #666;
}

.app-unit .unit-title .t-more {
    float: right;
    font-size: 14px;
    color: #999;
}

.app-unit .unit-content {
    position: relative;
    padding: 10px 15px 10px 15px;
}

.app-unit .unit-content>ul>li {
    line-height: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.app-unit .unit-content>ul>li>a {
    text-decoration: underline;
}

.app-unit .unit-content>ul>li>a:hover {
    color: #FF5722;
}
</style>
