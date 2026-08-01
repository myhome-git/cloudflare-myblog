<template>
  <a-collapse
    active-key="1"
    :accordion="false"
    :bordered="true"
    ghost
  >
    <a-collapse-panel key="1" :show-arrow="false">
      <template #header>
        <a-alert message="cloudflare 额度" type="info" />
      </template>
      <a-list item-layout="horizontal" :data-source="dataSource" size="small">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #title>
                {{ item.title }}
              </template>
              <template #description>
                {{ item.remarks }}
              </template>                            
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-collapse-panel>
    <a-collapse-panel key="1" header="This is panel header 2" :show-arrow="false">
      <p>123</p>
    </a-collapse-panel>
  </a-collapse>
</template>
<script lang="ts" setup>
import { ref, onMounted, nextTick } from "vue";
/**
 * table模块
 */
interface DataItem {
    title: string;
    remarks: string;
    content: {
        read: number;
        put: number;
        delete: number;
    },
    contentUsed: {
        read: number;
        put: number;
        delete: number;
    };
}
const dataSource = ref(<DataItem[]>[]);


// 挂在事件
onMounted(async () => {
    // 使用 $nextTick 确保 DOM 已经渲染完成
    await nextTick(() => {
        // handleGetList();
    });
});
</script>
<style scoped>
:deep(.ant-collapse-header) {
    padding: 0 !important;
}

:deep(.ant-collapse) {
    border-radius: 0 !important;
}

:deep(.ant-alert) {
    border-radius: 0 !important;
    border: 0 !important;
}

:deep(.ant-alert-message) {
    font-size: 16px !important;
    font-weight: 500 !important;
    padding: 0px 16px !important;
}
</style>
