<script setup lang="ts">
import { onBeforeMount,onMounted, nextTick, onUnmounted } from 'vue';
import { RouterView } from 'vue-router';
// @ts-ignore
import { initHandleSystemMessage, clearHandleCloseChannel, handleSendSystemMessage } from './utils/SystemSessionMessage.js';
handleSendSystemMessage({
  command: "req.isLogin"
});
// 挂载事件
onBeforeMount(() => {
  // 监听消息
  initHandleSystemMessage();
  handleSendSystemMessage("req.isLogin");
});
onMounted(async () => {
  // 使用 $nextTick 确保 DOM 已经渲染完成
  await nextTick(() => {
    
  });
});

onUnmounted(() => {
  clearHandleCloseChannel();
});
</script>
<template>
  <RouterView></RouterView>
</template>
