<template>
    <div class="header-login">
        <template v-if="isLogin">
            <a href="javascript:void(0);" @click="handleItemClickWrapper({}, '/admin')">
                <DashboardOutlined />
                <span>转到后台</span>
            </a>
        </template>
        <template v-else>
            <a href="javascript:void(0);" @click="handleItemClickWrapper({}, '/login')">
                <UserOutlined />
                <span>管理员登录</span>
            </a>
        </template>
    </div>
</template>
<script setup lang="ts">
import { isValidValue, handleItemClick } from '@/utils/utils';
import { useRouter } from "vue-router";
import { UserOutlined, DashboardOutlined } from '@ant-design/icons-vue';
const router = useRouter();

const isLogin = isValidValue(sessionStorage.getItem('username'));

// 处理列表项点击事件
const handleItemClickWrapper = (obj: any, url: string) => {
    handleItemClick(obj, url, router, false);
};
</script>
<style scoped>
.header-login {
    /* 位置由 Header 的 flex 布局控制，不再绝对定位 */
    white-space: nowrap;
    text-align: right;
}

.header-login a {
    padding: 0px 10px 0px 10px;
    font-size: 16px;
}

.header-login a:hover {
    color: #FF5722;
}

.header-login a :deep(.anticon) {
    font-size: 16px;
    margin-right: 5px;
}

.header-login a:hover :deep(.anticon) {}

/* 手机：隐藏文字只留图标，给搜索框让出空间 */
@media (max-width: 767px) {
    .header-login a {
        font-size: 0;
        padding: 0px 6px;
    }

    .header-login a :deep(.anticon) {
        font-size: 20px;
        margin-right: 0;
    }
}
</style>
