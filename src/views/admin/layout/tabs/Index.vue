<template>
  <div class="tabs-container">
    <!-- 标签栏 -->
    <div class="tabs-bar">
      <a-tabs
        v-model:activeKey="tagsViewStore.activeTagPath"
        type="editable-card"
        hideAdd
        :tabBarStyle="{ margin: 0 }"
        @tabClick="switchTag"
        @edit="handleEdit"
      >
        <a-tab-pane
          v-for="tag in tagsViewStore.visitedViewsFiltered"
          :key="tag.path"
          :closable="tag.path !== '/admin/welcome'"
        >
          <template #tab>
            <a-dropdown :trigger="['contextmenu']">
              <div class='tabs-tab-span'
                :draggable="tag.path !== '/admin/welcome'"
                @contextmenu.prevent
                @dragstart="onDragStart($event, tag.path)"
                @dragover.prevent="onDragOver($event, tag.path)"
                @drop.prevent="onDrop($event, tag.path)"
                @dragend="onDragEnd"
              >{{ tag.title }}</div>
              <template #overlay>
                <a-menu @click="(info: any) => handleContextMenu(info.key as string, tag)">
                  <a-menu-item key="closeCurrent">关闭当前</a-menu-item>
                  <a-menu-item key="closeOthers">关闭其它</a-menu-item>
                  <a-menu-item key="closeAll">关闭所有</a-menu-item>
                  <a-menu-item key="closeRight">关闭右侧</a-menu-item>
                  <a-menu-item key="closeLeft">关闭左侧</a-menu-item>
                  <a-menu-item key="refresh">刷新</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </a-tab-pane>
      </a-tabs>
    </div>
    <!-- 路由视图（单实例，配合 KeepAlive 缓存） -->
    <div class="tabs-content">
      <RouterView v-slot="{ Component, route: viewRoute }">
        <KeepAlive :include="tagsViewStore.cacheNames">
          <component :is="Component" :key="tagsViewStore.getRefreshKey(viewRoute.path)" />
        </KeepAlive>
      </RouterView>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { RouterView, useRouter, useRoute } from 'vue-router'
import { useTagsViewStore, type TagView } from '@/stores/tagsView'

const router = useRouter()
const route = useRoute()
const tagsViewStore = useTagsViewStore()

// 拖拽状态
const dragFromPath = ref<string | null>(null)

/** 拖拽开始 */
function onDragStart(event: DragEvent, path: string) {
  if (path === '/admin/welcome') {
    event.preventDefault()
    return
  }
  dragFromPath.value = path
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', path)
  }
}

/** 拖拽经过 */
function onDragOver(event: DragEvent, path: string) {
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

/** 拖拽放下 */
function onDrop(event: DragEvent, toPath: string) {
  if (!dragFromPath.value) return
  if (dragFromPath.value === toPath) return
  tagsViewStore.moveTag(dragFromPath.value, toPath)
  dragFromPath.value = null
}

/** 拖拽结束 */
function onDragEnd() {
  dragFromPath.value = null
}

// 监听路由变化，自动添加标签页
watch(
  () => route.path,
  (newPath) => {
    if (newPath.startsWith('/admin/')) {
      const tag: TagView = {
        path: route.path,
        fullPath: route.fullPath,
        query: route.query,
        params: route.params,
        meta: route.meta,
        title: (route.meta?.title as string) || (route.name as string) || '未命名'
      }
      tagsViewStore.addVisitedView(tag)
      tagsViewStore.setActiveTag(route.path)
    }
  },
  { immediate: true }
)

// 切换标签页
function switchTag(key: string) {
  if (key !== route.path) {
    router.push(key)
  }
}

// 处理标签编辑（关闭）
function handleEdit(key: string | number, action: 'add' | 'remove') {
  if (action === 'remove') {
    const tag = tagsViewStore.visitedViewsFiltered.find(t => t.path === key)
    if (tag) {
      removeTag(tag)
    }
  }
}

// 移除标签页
function removeTag(tag: TagView) {
  const redirectPath = tagsViewStore.closeTag(tag)
  if (redirectPath) {
    router.push(redirectPath)
  }
}

// ========== 右键菜单处理 ==========
function handleContextMenu(key: string, tag: TagView) {
  switch (key) {
    case 'closeCurrent':
      removeTag(tag)
      break
    case 'closeOthers':
      tagsViewStore.closeOtherTags(tag)
      break
    case 'closeAll':
      tagsViewStore.closeAllTags()
      router.push('/admin/welcome')
      break
    case 'closeRight':
      tagsViewStore.closeRightTags(tag)
      break
    case 'closeLeft':
      tagsViewStore.closeLeftTags(tag)
      break
    case 'refresh':
      tagsViewStore.refreshTag(tag)
      break
  }
}
</script>

<style scoped>
.tabs-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tabs-bar {
  flex-shrink: 0;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
}

/* 让 tab 的 padding 由内部 div 控制，使整个 tab 区域都可右键点击 */
.tabs-bar :deep(.ant-tabs-tab) {
  padding: 0;
}

.tabs-content {
  flex: 1;
  padding: 0;
  overflow: auto;
}
.tabs-tab-span{
  user-select:none;
  align-items:center;
  display: flex;
  width:100%;
  height:100%;
  padding:8px 12px;
  box-sizing:border-box;
}
.ant-tabs-tab{
  margin-left: 5px;
}
:deep(.ant-tabs .ant-tabs-tab-remove){
  margin: 0px 4px 0px -4px;
}
</style>
