<template>
  <div v-html="value"></div>
</template>
<script lang="ts" setup>
// @ts-ignore
import { initModal } from '@/hooks/useModal'

// 接收父层传递对象
const props = defineProps({
    data: {
      type: Object,
      required: false,
      default: []
    }
});

const value = `
  <div style="text-align: left;padding:10px 15px;margin-bottom:15px;">
      您确认要删除${
        props.data.length ? 
          '&nbsp;<span style="color:red;font-size:18px;">' +
          props.data.length+'条</span>&nbsp;' : ''
      }数据吗？删除后不可恢复！
    </div>
`

initModal({
  confirmDisabled() {
    return false
  },
  confirm() {
    return Promise.resolve(true)
  }
})
</script>