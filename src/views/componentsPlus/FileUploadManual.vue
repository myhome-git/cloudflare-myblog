<template>
</template>
<script lang="ts" setup>
import { ref, defineProps } from 'vue';
// @ts-ignore
import request from "@/utils/request.js";

/**
 * 手动提交文件
 * @param info 
 */

const props = defineProps({
  apiURL: {
    type: String,
    required: false,
    default: "/api/files/upload"
  }
});

const headers = ref({
  authorization: 'authorization-text',
  tempfilename: ""
});

const apiURL = ref(props.apiURL);
const handleUpload = (file: any, callback: Function) => {
  const value = headers.value;
  value.tempfilename = encodeURIComponent(file.name);
  const formData = new FormData();
  formData.append(`file`, file);
  // You can use any AJAX library you like
  request(apiURL.value, {
    method: 'post',
    headers : headers.value,
    data: formData,
  }).then((data: any) => {
    callback ? callback(null, data) : "";
  }).catch((error: any) => {
    callback ? callback(error) : "";
  });
};

// 暴露给父组件的方法
defineExpose({ handleUpload });
</script>