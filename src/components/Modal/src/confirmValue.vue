<template>
  <div v-html="props.data"></div>
</template>
<script lang="ts" setup>
// @ts-ignore
import { initModal } from '@/hooks/useModal'

// 接收父层传递对象
const props = defineProps({
    data: {
      type: [Object, String],
      required: false,
      default: ''
    }
});

initModal({
  confirmDisabled() {
    return false
  },
  confirm() {
    return Promise.resolve(true)
  }
})

</script>
