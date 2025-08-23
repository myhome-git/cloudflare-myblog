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
import { UserOutlined, DashboardOutlined, EnterOutlined } from '@ant-design/icons-vue';
const router = useRouter();

const isLogin = isValidValue(sessionStorage.getItem('token'));

// 处理列表项点击事件
const handleItemClickWrapper = (obj: any, url: string) => {
    handleItemClick(obj, url, router, false);
};
</script>
<style scoped>
.header-login {
    position: absolute;
    right: 0px;
    top: 0px;
    padding: 10px 0px 10px 0px;
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
</style>
