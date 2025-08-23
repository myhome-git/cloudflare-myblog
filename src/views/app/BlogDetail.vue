<template>
  <div x-list>
    <template v-if="rowData">
      <template v-if="isValidValue(rowData)">
        <div class="x-detail">
          <div class="x-title">
            <div class="t-text">{{ rowData.title }}</div>
            <div class="t-other">
              <span class="t-time">时间：{{ rowData.create_time }}</span>
              <span class="t-read-count">阅读量：{{ rowData.readCount }}</span>
            </div>
          </div>
          <div class="x-content">
            <MarkdownEditor ref="refMarkdownEditor" type="view" :value="rowData.content" :onAfterChange="onAfterChange"
              :onAfterAsyncRender="onAfterAsyncRender" />
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <a-alert message="数据小精灵正在玩捉迷藏，暂时还没有找到它呢~" type="warning" closable />
      <div class="x-detail">
        <div class="x-title">
          <div class="t-text">信息之海浩瀚无垠，这次可能没有捞到你想要的那条鱼。</div>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
// @ts-ignore
import SystemConfig from '@/SystemConfig.js';
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { isValidValue, handleDecodemultiple, handleItemClick } from "@/utils/utils.js";
// @ts-ignore
import request from "@/utils/request.js";
import { useRoute, useRouter } from 'vue-router';
import MarkdownEditor from "@/views/componentsPlus/MarkdownEditor.vue";

// 声明常量
const route = useRoute();
const router = useRouter();

// 数据源
const apiURL = `${SystemConfig.host}/api/app/blogs/query`;
const refMarkdownEditor = ref(null);
const rowData = ref(<any>{});
const pagination = ref({
  size: 1,
  index: 1,
  total: 0
});

const handleGetList = () => {
  let sendParams = Object.assign({
    id: route.query.id
  }, pagination.value);
  Object.assign(sendParams, route.query);
  request({
    url: `${apiURL}/getBlogReadById`,
    params: sendParams
  }).then((data: any) => {
    const result = data.result;
    result.forEach((element: any) => {
      try {
        element = handleDecodemultiple(element, element.key, ["title", "content"]);
      } catch (error) {

      }
    });
    try {
      rowData.value = result[0];
    } catch (error) {

    }
  }).catch((err: any) => {
    console.log(err);
  });
};

const setValue = (val: string) => {
  const value: any = refMarkdownEditor.value;
  try {
    // @ts-ignore
    value && value.setValue(val);
  } catch (error) {
    console.log(error);
  }
}

const onAfterChange = (obj: any) => {

}
const onAfterAsyncRender = (obj: any) => {
  // setTimeout(() => {
  //   setValueA(obj);
  // }, 1000)
}

const setValueA = (obj: any) => {
  const value: any = refMarkdownEditor.value;
  try {
    // target=_blank
    // @ts-ignore
    const $ = window.$;
    const $dom = $(`#${value.getUUID()} .cherry-previewer a`);
    // console.log(`找到a标签数量`, $dom.length);
    $dom.attr("target", "_blank");
  } catch (error) {

  }
}

watch(() => rowData.value, (newVal, oldVal) => {
  if (newVal) {
    setValue(newVal.content);
  }
})
// 监听路由变化，重新获取数据
watch(route, (to, from) => {
  // 重新获取数据
  handleGetList();
});

// 挂载事件
onMounted(async () => {
  // 使用 $nextTick 确保 DOM 已经渲染完成
  await nextTick(() => {
    handleGetList();
  });
});
</script>

<style scoped>
.x-detail {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #fff;
  padding-top: 80px;
  position: relative;
}

.x-detail .x-title {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: auto;
  overflow: auto;
  background: #fff;
  z-index: 10;
}

.x-detail .x-title .t-text {
  font-size: 22px;
  font-weight: bold;
  color: #666;
  padding: 20px 20px 0px 20px;
}

.x-detail .x-title .t-other {
  font-size: 14px;
  color: #999;
  padding: 10px 20px 20px 20px;
}

.x-detail .x-title .t-other .t-time {
  margin-right: 10px
}

:deep(.x-detail .x-content .cherry) {
  /* box-shadow: none ; */
  /* background: none ; */
}

:deep(.x-detail .x-content .cherry-previewer) {
  background: none !important;
  padding: 20px !important;
}
</style>
