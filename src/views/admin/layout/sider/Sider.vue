<template>
    <a-layout-sider v-model:collapsed="collapsed" collapsible theme="light" width="260">
        <div class="logo">
            <BookOutlined class="logo-icon" />
            <span v-if="!collapsed" class="logo-text">博客管理系统</span>
        </div>
        <a-menu id="dddddd" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" style="width: auto"
            mode="inline" :items="items" @click="handleClick"></a-menu>
    </a-layout-sider>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, VueElement, h } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';
import {
    HomeOutlined,
    MailOutlined,
    AppstoreOutlined,
    SettingOutlined,
    UserOutlined,
    MehOutlined,
    UnorderedListOutlined,
    BookOutlined,
    DatabaseOutlined
} from '@ant-design/icons-vue';
import type { MenuProps, ItemType } from 'ant-design-vue';

const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['/']);
const openKeys = ref<string[]>(['/']);

// 获取路由对象
const router = useRouter();
const routerList = ref(router?.options?.routes);

function getItem(
    label: VueElement | string,
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
watch([openKeys, routerList], (val) => {
    // console.log('openKeys', val);
});
</script>
<style scoped>
/* Sider 组件边框 */
.ant-layout-sider {
    border-right: 1px solid #f0f0f0 !important;
}

:where(.css-dev-only-do-not-override-1p3hq3p).ant-menu-light.ant-menu-root.ant-menu-inline,
:where(.css-dev-only-do-not-override-1p3hq3p).ant-menu-light.ant-menu-root.ant-menu-vertical {
    border-inline-end: none !important;
}

/* 确保子菜单没有右边框 */
.ant-menu-sub {
    border-right: none !important;
    border-inline-end: none !important;
}

.logo {
    height: 32px;
    margin: 16px;
    background: rgba(24, 144, 255, 0.1);
    display: flex;
    align-items: center;
    padding: 0 16px;
    border-radius: 4px;
}

.logo-icon {
    font-size: 20px;
    color: #1890ff;
}

.logo-text {
    margin-left: 12px;
    font-size: 16px;
    font-weight: 600;
    color: #1890ff;
    white-space: nowrap;
    transition: opacity 0.3s;
}

.site-layout .site-layout-background {
    background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
    background: #141414;
}

a {
    /* 或者更具体的选择器，例如 router-link-active */
    text-decoration: none;
    /* 移除下划线 */
    color: inherit;
    /* 继承父元素的颜色 */
    /* 其他样式重置 */
}

a:hover {
    /* 或者更具体的选择器，例如 router-link-active */
    color: inherit;
    /* 继承父元素的颜色 */
    transition: none;
}
</style>
