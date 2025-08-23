<template v-if="list">
    <template v-for="(item, index) in list">
        <template v-if="item?.display !== false">
            <template v-if="item && item?.children && Array.isArray(item?.children)">
                <a-sub-menu :key="item?.path">
                    <template #title>
                        <span>
                            <template v-if="item.icon">
                                <home-outlined v-if="item.icon == 'home'"></home-outlined>
                                <book-outlined v-else-if="item.icon == 'dict'"></book-outlined>
                                <user-outlined v-else-if="item.icon == 'user'"></user-outlined>
                            </template>
                            <span> {{ item?.name }}</span>
                        </span>
                    </template>
                    <SiderMenu :list="item?.children"></SiderMenu>
                </a-sub-menu>
            </template>
            <template v-else>
                <a-menu-item :key="item?.path">
                    <a-space>
                        <template v-if="item.icon">
                            <home-outlined v-if="item.icon == 'home'"></home-outlined>
                            <book-outlined v-else-if="item.icon == 'dict'"></book-outlined>
                            <user-outlined v-else-if="item.icon == 'user'"></user-outlined>
                        </template>
                        <RouterLink :to="item?.path">
                            <span>{{ item?.name }}</span>
                        </RouterLink>
                    </a-space>
                </a-menu-item>
            </template>
        </template>
    </template>
</template>
<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import {
    UserOutlined,
    BookOutlined,
    HomeOutlined
} from '@ant-design/icons-vue';
import { ref, defineProps } from 'vue';
import SiderMenu from "./SiderMenu.vue";

// 定义子组件接收的 props
const props = defineProps({
    list: {
        type: <any>Array, // 数据类型
        required: true, // 是否必须
        default: '默认消息', // 默认值
    }
});

</script>