import { onMounted, onUnmounted } from 'vue'

/**
 * 动态注入 CSS 样式，组件销毁时自动移除
 * @param css CSS 文本内容
 * @param id 可选的样式 id，用于去重
 */
export function useStyle(css: string, id?: string) {
    const styleId = id || `dynamic-style-${Math.random().toString(36).slice(2, 10)}`

    onMounted(() => {
    // 避免重复插入
        if (document.getElementById(styleId)) { return }
        const style = document.createElement('style')
        style.id = styleId
        style.textContent = css
        document.head.appendChild(style)
    })

    onUnmounted(() => {
        const style = document.getElementById(styleId)
        if (style) {
            document.head.removeChild(style)
        }
    })
}