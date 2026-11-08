<template>
    <div id="form-search" class="x-head-search x-clearfix">
        <input
            v-model="inputSearchValue"
            type="text"
            placeholder="请输入搜索内容..."
            @keyup.enter="handleClick"
        >
        <div id="btn-search" class="x-search-btn x-inlineblock" @click="handleClick">
            <SearchOutlined />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
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
    width: 100%;
    height: 38px;
    border: 1px solid #ccc;
    border-radius: 20px;
    position: relative;
    color: #ccc;
    transition: all 0.3s ease-in-out 0s;
    /* 宽度与位置由 Header.vue 的 flex 布局控制，这里不再写死 left / width */
}

.x-head-search input {
    height: 36px;
    border: 0;
    border-radius: 20px 0px 0px 20px;
    /* 留出右侧按钮宽度（60px），宽度自适应父容器 */
    width: calc(100% - 60px);
    padding-left: 15px;
    background-color: transparent;
    outline: none;
}

/* 原先在输入区与按钮之间画的分隔线：自适应布局下位置不再固定，已移除 */

.x-head-search .x-search-btn {
    width: 46px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
    /* 贴搜索框右侧居中；宽度已由 input 的 calc 预留 */
    position: absolute;
    right: 6px;
    top: 0;
}

.x-head-search .x-search-btn .anticon-search {
    font-size: 24px;
    font-weight: 700;
    position: absolute;
    left: 10px;
    top: 3px;
    padding: 3px 10px;
}

.x-head-search.action-focus,
.x-head-search:hover {
    color: #3F3F3F;
    border: 1px solid #3F3F3F;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
}
</style>
