<template>
    <h1>index page</h1>
    <RouterView></RouterView>
</template>
<script lang="ts" setup>
import { RouterView, useRouter } from 'vue-router';
// 获取路由对象
const router = useRouter();
const currentRoute = router.currentRoute.value;
const routePath = currentRoute.path;
</script>
<style scoped></style>
