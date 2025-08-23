<template>
    <div id="form-search" class="x-head-search x-clearfix">
        <input type="text" placeholder="请输入搜索内容..." v-model="inputSearchValue" @keyup.enter="handleClick">
        <div id="btn-search" class="x-search-btn x-inlineblock" @click="handleClick">
            <SearchOutlined />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';

const emit = defineEmits(["onSearch"]);

const inputSearchValue = ref<string>('');
const handleClick = () => {
    // console.log(inputSearchValue.value);
    emit('onSearch', inputSearchValue.value);
}
</script>
<style scoped>
.x-head-search {
    width: 320px;
    height: 38px;
    border: 1px solid #ccc;
    border-radius: 20px;
    position: relative;
    position: absolute;
    top: 0;
    left: 455px;
    bottom: 0;
    margin: auto;
    color: #ccc;
    transition: all 0.3s ease-in-out 0s;
    /*box-shadow: 0px 0px 5px rgba(0,0,0,0.2);*/
}

.x-head-search:before {
    display: block;
    content: "";
    height: 100%;
    position: absolute;
    right: 60px;
    top: 0;
    border-left: inherit;
}

.x-head-search input {
    height: 36px;
    border: 0;
    border-radius: 20px 0px 0px 20px;
    width: 256px;
    padding-left: 15px;
    background-color: transparent;
}

.x-head-search .x-search-btn {
    width: 46px;
    text-align: center;
    cursor: pointer;
    float: right;
    margin-right: 13px;
    margin-top: 3px;
    position: relative;
}

.x-head-search .x-search-btn .anticon-search {
    font-size: 24px;
    font-weight: 700;
    position: absolute;
    left: 10px;
    top: 0px;
    padding: 3px 10px;
}

.x-head-search.action-focus,
.x-head-search:hover {
    color: #3F3F3F;
    border: 1px solid #3F3F3F;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
}
</style>
