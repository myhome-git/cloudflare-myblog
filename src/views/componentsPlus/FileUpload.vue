<template>
  <a-upload v-model:file-list="fileList" name="file" :action="props.url" v-model:headers="headers"
    :showUploadList="false" @change="handleChange" :before-upload="beforeUpload">
    <a-button type="primary" ghost>
      <upload-outlined></upload-outlined>
      上传文件
    </a-button>
  </a-upload>
</template>
<script lang="ts" setup>
import { ref, defineProps } from 'vue';
import { message } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import type { UploadChangeParam } from 'ant-design-vue';

const props = defineProps({
  url: {
    type: String,
    required: false,
    default: "/api/files/upload"
  }
});

const emit = defineEmits(["onUploadSuccess"]);

const headers = ref({
  authorization: 'authorization-text',
  tempfilename: ""
});

const beforeUpload = (file) => {
  const value = headers.value;
  value.tempfilename = encodeURIComponent(file.name);
  return true;
}

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status !== 'uploading') {
    // console.log(info.file, info.fileList);
  }
  if (info.file.status === 'done') {
    console.log(info);
    try {
      const response = info.file.response;
      emit("onUploadSuccess",response.result);
    } catch (error) {
      console.error(error.message);
    }
    message.success(`${info.file.name} file uploaded successfully`);
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
  }
};

const fileList = ref([]);
</script>