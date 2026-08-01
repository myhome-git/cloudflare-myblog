<template>
  <div class="app-win">
    <link rel="stylesheet" href="//at.alicdn.com/t/font_1281105_ue0q9rvh0lb.css">
    <div class="x-container">
      <Header @on-search="onSearch"></Header>
    </div>
    <div class="x-layout layout-nav">
      <div class="x-container">
        <Nav :data-source="dataSourceNav"></Nav>
      </div>
    </div>
    <div class="x-container flex-auto">
      <div class="layout-content">
        <Content>
          <template #left>
            <RouterView></RouterView>
          </template>
          <template #right>
            <Hot :data-source="dataSourceHot"></Hot>
            <div style="height: 14px;"></div>
            <Link :data-source="dataSourceLink">
            </Link>
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
// @ts-ignore
import { RouterView } from 'vue-router';
import { ref, onMounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { isValidValue, handleDecodemultiple, handleItemClick } from "@/utils/utils.js";
// @ts-ignore
import request from "@/utils/request.js";
// @ts-ignore
import './assets/css/common.css';
import Header from './layout/Header.vue';
import Nav from './layout/Nav.vue';
import Content from './layout/Content.vue';
import Hot from './Hot.vue';
import Link from './Link.vue';
import Footer from './layout/Footer.vue';

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
