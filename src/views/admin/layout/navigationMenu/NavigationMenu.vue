<template>
    <a-menu v-model:selected-keys="current" mode="horizontal" @click="onClick">
        <a-menu-item key="target-to-app">
            <template #icon>
                <HomeOutlined />
            </template>
            转到前台
        </a-menu-item>
        <ThemeSetting />
        <a-menu-item key="out-system">
            <template #icon>
                <SettingOutlined />
            </template>
            退出系统
        </a-menu-item>
    </a-menu>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { SettingOutlined, HomeOutlined } from '@ant-design/icons-vue';
import ThemeSetting from './ThemeSetting.vue';
import request from "@/utils/request";

const current = ref<string[]>(['app']);
const router = useRouter();
const onClick = (info: { key: string; keyPath: string[] }) => {
    const key = info.key;
    switch (key) {
        case 'target-to-app':
            router.push('/app');
            break;
        case 'out-system':
            onUserOut();
            break;
        default:
            console.log('Unknown menu item selected');
    }
    setTimeout(() => {
        current.value = [];
    }, 300);
}

// 编辑
const onUserOut = () => {
    request({
        url: `/api/user/out`
    }).then(() => {
        sessionStorage.removeItem("username");
        router.push('/');
    }).catch((err: any) => {
        console.error(err);
    });

};
</script>
<style scoped>
.ant-menu-horizontal {
  width: 380px;
  border-bottom: 0;
}
</style>