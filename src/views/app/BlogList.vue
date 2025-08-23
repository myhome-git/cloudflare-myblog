<template>
    <template v-if="isServerResult.status === 200">
        <template v-if="isValidValue(route.query.searchText)">
            <template v-if="pagination.total < 1">
                <a-alert :message="`信息之海浩瀚无垠，这次可能没有捞到你想要的那条鱼！`" type="warning" show-icon closable></a-alert>
            </template>
            <template v-else>
                <a-alert :message="`${seMessage}`" type="success" show-icon closable />
                <div style="height: 10px;"></div>
                <BlogJianshu :dataSource="dataSource" :pagination="pagination" :onPageChange="onPageChange">
                </BlogJianshu>
            </template>
        </template>
        <template v-else>
            <template v-if="pagination.total < 1">
                <a-alert :message="`暂无数据！`" type="warning" show-icon closable></a-alert>
            </template>
            <template v-else>
                <BlogJianshu :dataSource="dataSource" :pagination="pagination" :onPageChange="onPageChange">
                </BlogJianshu>
            </template>
        </template>
    </template>
    <template v-else>
        <template v-if="isServerResult.status === 500">
            <a-alert :message="isServerResult.message" type="error" show-icon closable></a-alert>
        </template>
        <template v-else>
            <div class="loading-box">{{ isServerResult.message }}</div>
        </template>
    </template>
</template>
<script lang="ts" setup>
// @ts-ignore
import SystemConfig from "@/SystemConfig.js";
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { isValidValue, handleDecodemultiple, handleItemClick } from "@/utils/utils.js";
// @ts-ignore
import request from "@/utils/request.js";
import { useRoute, useRouter } from 'vue-router';
import BlogJianshu from './BlogJianShu.vue';
import { error } from "jquery";

const route = useRoute();
const router = useRouter();

// 数据源
const apiURL = `${SystemConfig.host}/api/app/blogs/query`;
const dataSource = ref([]);
const pagination = ref({
    size: 10,
    index: 1,
    total: 0
});
const isServerResult = ref({
    status: 0,
    message: ''
});

const handleGetList = () => {
    const isServerResultValue = isServerResult.value;
    isServerResultValue.status = 0;
    isServerResultValue.message = 'Loading...';
    let sendParams = Object.assign({}, pagination.value);
    Object.assign(sendParams, route.query);
    request({
        url: `${apiURL}/list/jianshu`,
        params: sendParams
    }).then((data: any) => {
        isServerResultValue.status = 200;
        const result = data.result;
        const value = dataSource.value;
        value.splice(0, value.length);
        result.forEach((element: any) => {
            try {
                element = handleDecodemultiple(element, element.key, ["title", "jianshu"]);
            } catch (error) {

            }
            // @ts-ignore
            value.push(element);
        });
        // @ts-ignore
        const page = data.page || {};
        const val = pagination.value;
        val.total = page.total;
        //如果没有数据，则跳回上一页
        if (result.length < 1) {
            if (val.index > 1) {
                val.index = val.index - 1;
                setTimeout(() => {
                    handleGetList();
                }, 100);
            }
        }
        setMessage();
    }).catch((err: any) => {
        isServerResultValue.status = 500;
        isServerResultValue.message = `Error：${err.data.message || err.message}`;
    }).finally(() => {

    });
};

// 分页回调
const onPageChange = (index: number, size: number) => {
    const value = pagination.value;
    value.index = index;
    value.size = size;
    // 使用 Vue Router 更新查询参数
    handleItemClick({
        index: value.index.toString(),
        size: value.size.toString()
    }, '/app/blogs', router)
    handleGetList();
};

const seMessage = ref<string>('');
const setMessage = () => {
    if (isValidValue(route.query.searchText)) {
        if (pagination.value.total > 0) {
            seMessage.value = `数据小精灵也很欣慰，找到了【 ${pagination.value.total} 】条结果！`;
        } else {
            seMessage.value = ``;
        }
    }
};

// 挂载事件
onMounted(async () => {
    // 使用 $nextTick 确保 DOM 已经渲染完成
    await nextTick(() => {
        // console.log('DOM 渲染完成');
        // 从 URL 参数中读取分页信息
        let index = route.query.index as string;
        let size = route.query.size as string;
        // 如果 URL 参数不存在，则使用默认值
        if (!isValidValue(index)) {
            index = `1`;
        }
        if (!isValidValue(size)) {
            size = `10`;
        }
        if (index) {
            pagination.value.index = parseInt(index, 10);
        }
        if (size) {
            pagination.value.size = Math.min(20, parseInt(size, 10));
        }
        // console.log(pagination.value);
        handleGetList();
    });
});

// 监听路由变化，重新获取数据
watch(route, (to, from) => {
    // 从 URL 参数中读取分页信息
    let index = to.query.index as string;
    let size = to.query.size as string;
    let classId = to.query.classId as string;

    // 如果 URL 参数不存在，则使用默认值
    if (!isValidValue(index)) {
        index = `1`;
    }
    if (!isValidValue(size)) {
        size = `10`;
    }
    if (index) {
        pagination.value.index = parseInt(index, 10);
    }
    if (size) {
        pagination.value.size = Math.min(20, parseInt(size, 10));
    }

    // 重新获取数据
    handleGetList();
});
</script>
<style scoped>
.loading-box {
    line-height: 40px;
    color: #999;
    border: 1px solid #e8e8e8;
    padding: 0px 20px;
}
</style>
