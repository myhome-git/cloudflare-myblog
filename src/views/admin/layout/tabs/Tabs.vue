<template>
   <RouterView></RouterView>
</template>
<script lang="ts" setup>
import { onMounted, nextTick, onUnmounted } from 'vue';
import { RouterView, useRouter } from 'vue-router'

// 挂载事件
onMounted(async () => {
    // 使用 $nextTick 确保 DOM 已经渲染完成
    await nextTick(() => {
        
    });
});

onUnmounted(() => {
    
});
</script>
<style scoped>

</style>
