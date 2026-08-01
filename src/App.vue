<template>
  <RouterView></RouterView>
  <DynamicApp></DynamicApp>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, nextTick, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import PostMessage from './utils/postMessage.js'

const theme = ref('')
watch(() => theme.value, (newValue) => {
  document.body.className = newValue;
  localStorage.setItem('theme', newValue)
});

const { initHandleSystemMessage, clearHandleCloseChannel } = PostMessage((event: any) =>{
  const newValue = event.data?.data
  switch (event.data.type) {
      case 'themeChange':
          theme.value = newValue
          break
      default:
          break
  }
})

// 挂载事件
onBeforeMount(() => {
  // 监听消息
  initHandleSystemMessage()
})

onMounted(async () => {
  // 使用 $nextTick 确保 DOM 已经渲染完成
  await nextTick(() => {
    // DOM 已经渲染完成
    if(localStorage.getItem('theme')){
      theme.value = `${localStorage.getItem('theme')}`;
    }
  })
})

onUnmounted(() => {
  clearHandleCloseChannel()
})
</script>