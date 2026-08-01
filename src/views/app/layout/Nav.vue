<template>
  <div class="app-nav">
    <div class="li" :class="{ active: route.query.classId === 'home' }" @click="handleItemClickWrapper({}, '/')">
      Home
    </div>
    <template v-if="computedDataSource.length > 0">
      <template v-for="(item) of computedDataSource" :key="item.id">
        <li
          class="li"
          :class="{ active: route.query.classId === `${item.id}` }"
          @click="handleItemClickWrapper({ classId: item.id }, '/')"
        >
          <span>{{ item.name }}</span>
        </li>
      </template>
    </template>
  </div>
</template>
<script lang="ts" setup>
import {  computed, useAttrs } from 'vue';
import { handleItemClick } from '@/utils/utils';
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// 处理列表项点击事件
const handleItemClickWrapper = (obj: any, url: string) => {
    handleItemClick(obj, url, router, false);
};

// 透传对象属性和方法
const attrs = useAttrs();
const { dataSource } = attrs as {
    dataSource?: any[] | { value: any[] },
    onPageChange?: (index: number, size: number) => void,
    pagination?: {
        index: number,
        size: number,
        total: number
    }
};
// 计算属性，用于处理 dataSource
const computedDataSource = computed(() => {
    if (Array.isArray(dataSource)) {
        return dataSource;
    } else if (dataSource && dataSource.value && Array.isArray(dataSource.value)) {
        return dataSource.value;
    }
    return [];
});
</script>
<style>
.app-nav {
    line-height: 50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    list-style: none;
    position: relative;
}

.app-nav::before {
    display: block;
    content: '';
    height: 100%;
    border-left: 1px solid #ddd;
    position: absolute;
    left: 0;
    top: 0;
}

.app-nav::after {
    display: block;
    content: '';
    height: 100%;
    border-right: 1px solid #ddd;
    position: absolute;
    right: 0;
    top: 0;
}

.app-nav .li {
    padding: 0px 20px 0px 20px;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    color: #666;
    position: relative;
}

.app-nav .li::after {
    display: block;
    content: '';
    transition: all 0.3s;
    position: absolute;
    top: 18px;
    right: -1px;
    height: 16px;
    border-right: 1px solid #ccc;
}

.app-nav .li:first-child::before {
    display: none;
}

.app-nav .li:last-child::after {
    display: none;
}

.app-nav .li.active {
    color: #fff;
    background-color: #3f3f3f
}

.app-nav .li:hover {
    color: #fff;
    background-color: rgba(63, 63, 63, 0.7);
}
</style>
