<template>
  <a-layout-sider
    v-model:collapsed="collapsedComputed"
    collapsible
    theme="light"
    width="260"
  >
    <div class="logo">
      <BookOutlined class="logo-icon" />
      <span v-if="!collapsedComputed" class="logo-text">博客管理系统</span>
    </div>
    <a-menu
      v-model:open-keys="openKeys" 
      v-model:selected-keys="selectedKeys" 
      mode="inline"
      :items="items"
      @click="handleClick"
    ></a-menu>
  </a-layout-sider>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, computed, h } from 'vue';
import { useRouter } from 'vue-router';
import {
    HomeOutlined,
    SettingOutlined,
    UserOutlined,
    MehOutlined,
    UnorderedListOutlined,
    BookOutlined,
    DatabaseOutlined
} from '@ant-design/icons-vue';
import type { MenuProps, ItemType } from 'ant-design-vue';

const props = defineProps<{
    collapsed: boolean;
}>();

const emit = defineEmits<{
    'update:collapsed': [value: boolean];
}>();

const collapsedComputed = computed({
    get: () => props.collapsed,
    set: (value: boolean) => emit('update:collapsed', value),
});

const selectedKeys = ref<string[]>(['/']);
const openKeys = ref<string[]>(['/']);

// 获取路由对象
const router = useRouter();
const routerList = ref(router?.options?.routes);

function getItem(
    label: any,
    key: string,
    icon?: any,
    children?: ItemType[],
    type?: 'group',
): ItemType {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as ItemType;
}

const tempTest = (list: any) => {
    const newlist: any = [];
    list.forEach((element: any) => {
        // 过滤掉 display===false 的菜单项
        if (element.display === false) {
            return;
        }

        let it = null, iconResult = null;
        switch (element.icon) {
            case "home":
                iconResult = () => h(HomeOutlined);
                break;
            case "set":
                iconResult = () => h(SettingOutlined);
                break;
            case "user":
                iconResult = () => h(UserOutlined);
                break;
            case "about":
                iconResult = () => h(MehOutlined);
                break;
            case "list":
                iconResult = () => h(UnorderedListOutlined);
                break;
            case "database":
                iconResult = () => h(DatabaseOutlined);
                break;
            default:
                break;
        }
        if (element.children) {
            const childList = tempTest(element.children);
            it = getItem(element.__name, element.path, iconResult, childList);
        } else {
            it = getItem(element.__name, element.path, iconResult, undefined, undefined);
        }
        newlist.push(it);
    });
    return newlist;
}

// 只保留路径/admin
const newRouterList: any = [];
routerList.value.map((item: any) => {
    if (item.path === "/admin") {
        if (item.children) {
            item.children.map((it: any) => {
                newRouterList.push(it);
            });
        } else {
            newRouterList.push(item);
        }
    }
});
const items: ItemType[] = reactive(tempTest(newRouterList));
const handleClick: MenuProps['onClick'] = e => {
    // @ts-ignore
    router.push({ path: e.key });
};
watch([openKeys, routerList], () => {
    // console.log('openKeys', val);
});
</script>
<style scoped>
.ant-menu{
    height:calc(100% - 17px);
    overflow: auto;
}
.ant-menu-light{
  background: transparent;
}
.ant-layout-sider {
    border-right-width: 1px;
    border-right-style: solid;
    border-right-color: rgba(var(--appwin--border-color-rgb), var(--appwin--border-color-opacity));
}
:deep(.ant-layout-sider-trigger){
    display: none;
}
.ant-menu-light.ant-menu-root.ant-menu-inline,
.ant-menu-light.ant-menu-root.ant-menu-vertical {
    border-inline-end: none !important;
}

/* 确保子菜单没有右边框 */
.ant-menu-sub {
    border-right: none !important;
    border-inline-end: none !important;
}

.logo {
    position: relative;
    padding: 20px 26px;
    display: flex;
    align-items: center;
    font-size: 20px;
    background-color: rgba(var(--appwin--bg-color-rgb), calc(var(--appwin--bg-color-opacity) + 1));
    color: rgba(var(--appwin--color), var(--appwin--color-opacity));
}
.logo::after{
    content: '';
    display: block;
    position: absolute;
    right: -1px;
    top: 0;
    height: 100%;
    border-right-width: 1;
    border-right-style: solid;
    border-right-color: rgba(var(--appwin--bg-color-rgb), calc(var(--appwin--bg-color-opacity) + 1));
}

.logo-icon {
    font-size: 20px;
}

.logo-text {
    margin-left: 12px;
    font-weight: 600;
    white-space: nowrap;
    transition: opacity 0.3s;
    height: 20px;
    line-height: 20px;
    text-shadow: 1px 1px #555, 1px 1px #444, 2px 2px #333;
}

a {
    text-decoration: none;
    color: inherit;
}

a:hover {
    color: inherit;
    transition: none;
}
:deep(.ant-menu-light .ant-menu-item-selected){
    background-color: rgba(var(--appwin--bg-color-rgb), 0.75);
    color: rgba(var(--appwin--color), var(--appwin--color-opacity));
}
</style>