import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

// 标签页接口定义
export interface TagView extends Partial<RouteLocationNormalized> {
  title?: string
  name?: string
  path: string
  fullPath?: string
  query?: Record<string, any>
  params?: Record<string, any>
  meta?: Record<string, any>
}

/** 首页标签页固定配置 */
const WELCOME_TAG: TagView = {
  path: '/admin/welcome',
  title: '首页',
  meta: { title: '首页' }
}

/** sessionStorage 存储键名 */
const STORAGE_KEY = 'admin-tags-view'
const ACTIVE_TAG_KEY = 'admin-active-tag-path'

export const useTagsViewStore = defineStore('tagsView', () => {
  // ========== 状态 ==========
  /** 当前打开的标签页列表（从 sessionStorage 恢复，确保首页始终存在） */
  const visitedViews = ref<TagView[]>(ensureWelcomeTag(loadVisitedViews()))
  /** 当前激活的标签页路径 */
  const activeTagPath = ref<string>(loadActiveTagPath())
  /** 每个标签页的刷新计数器（key=路由路径，value=递增计数） */
  const refreshCountMap = ref<Record<string, number>>({})

  // ========== 计算属性 ==========
  /** 获取已访问的标签页列表（不含隐藏路由） */
  const visitedViewsFiltered = computed(() => {
    return visitedViews.value.filter(tag => !tag.meta?.hidden)
  })

  /** 当前激活的标签页对象 */
  const currentTag = computed(() => {
    return visitedViews.value.find(tag => tag.path === activeTagPath.value)
  })

  /** 计算需要缓存的组件名称列表 */
  const cacheNames = computed(() => {
    return visitedViewsFiltered.value.map(tag => {
      let name = tag.path.replace(/[^a-zA-Z0-9]/g, '_');
      if (name.startsWith('_')) name = name.substring(1);
      return 'R_' + name;
    });
  })

  // ========== 持久化 ==========

  /** 从 sessionStorage 加载标签页列表（自动去重，按 path 取最后出现的） */
  function loadVisitedViews(): TagView[] {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed: TagView[] = JSON.parse(saved)
        return deduplicateByPath(parsed)
      }
    } catch (e) {
      console.warn('Failed to load tags from sessionStorage:', e)
    }
    return []
  }

  /** 按 path 去重，保留最后出现的 */
  function deduplicateByPath(tags: TagView[]): TagView[] {
    const map = new Map<string, TagView>()
    for (const tag of tags) {
      map.set(tag.path, tag)
    }
    return Array.from(map.values())
  }

  /** 确保首页标签始终存在 */
  function ensureWelcomeTag(tags: TagView[]): TagView[] {
    const hasWelcome = tags.some(tag => tag.path === '/admin/welcome')
    if (!hasWelcome) {
      return [WELCOME_TAG, ...tags]
    }
    return tags
  }

  /** 从 sessionStorage 加载激活的标签路径 */
  function loadActiveTagPath(): string {
    try {
      return sessionStorage.getItem(ACTIVE_TAG_KEY) || '/admin/welcome'
    } catch (e) {
      return '/admin/welcome'
    }
  }

  /** 保存标签页列表到 sessionStorage */
  function saveVisitedViews() {
    try {
      const toSave = visitedViews.value.map(tag => ({
        path: tag.path,
        fullPath: tag.fullPath,
        title: tag.title,
        name: tag.name,
        query: tag.query,
        meta: tag.meta
      }))
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    } catch (e) {
      console.warn('Failed to save tags to sessionStorage:', e)
    }
  }

  /** 保存激活的标签路径到 sessionStorage */
  function saveActiveTagPath() {
    try {
      sessionStorage.setItem(ACTIVE_TAG_KEY, activeTagPath.value)
    } catch (e) {
      console.warn('Failed to save active tag path:', e)
    }
  }

  // 监听标签页变化，自动保存
  watch(
    visitedViews,
    () => { saveVisitedViews() },
    { deep: true }
  )

  watch(
    activeTagPath,
    () => { saveActiveTagPath() }
  )

  // ========== 操作方法 ==========

  /**
   * 添加标签页
   */
  function addVisitedView(view: TagView) {
    // 如果已存在则不添加
    if (visitedViews.value.some(tag => tag.path === view.path)) {
      return
    }
    visitedViews.value.push({
      ...view,
      title: view.title || view.meta?.title || view.name || '未命名'
    })
  }

  /**
   * 设置当前激活的标签页路径
   */
  function setActiveTag(path: string) {
    activeTagPath.value = path
  }

  /**
   * 关闭指定标签页（首页不可关闭）
   */
  function closeTag(tag: TagView): string | null {
    if (tag.path === '/admin/welcome') return null

    const index = visitedViews.value.findIndex(t => t.path === tag.path)
    if (index === -1) return null

    visitedViews.value.splice(index, 1)

    if (tag.path === activeTagPath.value) {
      if (visitedViews.value.length > 0) {
        const newIndex = Math.min(index, visitedViews.value.length - 1)
        return visitedViews.value[newIndex]?.path || null
      }
      return null
    }
    return null
  }

  /**
   * 关闭当前标签页
   */
  function closeCurrentTag(): string | null {
    if (currentTag.value) {
      return closeTag(currentTag.value)
    }
    return null
  }

  /**
   * 关闭其他标签页（首页永远不会被关闭）
   */
  function closeOtherTags() {
    visitedViews.value = visitedViews.value.filter(
      tag => tag.path === activeTagPath.value || tag.path === '/admin/welcome'
    )
  }

  /**
   * 关闭所有标签页（保留首页）
   */
  function closeAllTags() {
    visitedViews.value = [WELCOME_TAG]
    activeTagPath.value = '/admin/welcome'
  }

  /**
   * 关闭右侧标签页（首页不会受影响）
   */
  function closeRightTags(tag: TagView) {
    const index = visitedViews.value.findIndex(t => t.path === tag.path)
    if (index === -1) return
    // 确保首页始终保留
    const welcomeIndex = visitedViews.value.findIndex(t => t.path === '/admin/welcome')
    if (welcomeIndex !== -1 && welcomeIndex > index) {
      return // 首页在右侧，不关闭
    }
    visitedViews.value = visitedViews.value.slice(0, index + 1)
  }

  /**
   * 关闭左侧标签页（首页永远不会被关闭）
   */
  function closeLeftTags(tag: TagView) {
    const index = visitedViews.value.findIndex(t => t.path === tag.path)
    if (index === -1) return
    // 保留首页
    visitedViews.value = [visitedViews.value[0], ...visitedViews.value.slice(index)]
  }

  /**
   * 刷新标签页（递增该标签页的刷新计数器，通过改变 :key 强制 Vue 销毁重建组件）
   */
  function refreshTag(tag: TagView) {
    const path = tag.path
    refreshCountMap.value = {
      ...refreshCountMap.value,
      [path]: (refreshCountMap.value[path] || 0) + 1
    }
  }

  /**
   * 获取指定路径的刷新 key（用于组件 :key 绑定）
   */
  function getRefreshKey(path: string): string {
    return path + '-r' + (refreshCountMap.value[path] || 0)
  }

  return {
    visitedViews,
    activeTagPath,
    refreshCountMap,
    visitedViewsFiltered,
    currentTag,
    cacheNames,
    addVisitedView,
    setActiveTag,
    closeTag,
    closeCurrentTag,
    closeOtherTags,
    closeAllTags,
    closeRightTags,
    closeLeftTags,
    refreshTag,
    getRefreshKey
  }
})