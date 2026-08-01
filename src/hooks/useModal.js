import Modal from '@/components/Modal/src/index.vue'
import { getCurrentInstance, reactive, defineComponent, h, shallowRef, computed } from 'vue'

// 存储所有动态模态框的仓库
const modalStore = reactive({
    modals: []
})

// 存储通过 initModal 注册的配置
const modalConfigs = reactive({})

// 动态应用组件，用于渲染所有模态框
export const dynamicApp = defineComponent({
    name: 'DynamicApp',
    setup() {
    // 使用 computed 缓存模态框列表，避免不必要的重新渲染
        const modalList = computed(() => modalStore.modals)

        return function() {
            return modalList.value.map((modalItem) => {
                const modalConf = modalConfigs[modalItem.name]
                const modalName = modalItem.name

                // 构建稳定的模态框配置（仅在依赖变化时重建）
                const modalConfig = {
                    ...modalConf,
                    ...modalItem.config,
                    open: modalItem.config.modelValue,
                    // 处理模态框关闭事件
                    'onUpdate:open': (val) => {
                        modalItem.config.modelValue = val
                        if (!val) {
                            // 使用 modalName 查找并移除，避免 index 闭包陷阱
                            const idx = modalStore.modals.findIndex(m => m.name === modalName)
                            if (idx !== -1) {
                                modalStore.modals.splice(idx, 1)
                            }
                            // 清理配置
                            delete modalConfigs[modalName]
                        }
                    },
                    // 处理确认事件
                    handleClickOK: async(e) => {
                        const config = modalConfigs[modalName]
                        if (config?.confirm) {
                            const data = await config.confirm(e)
                            modalItem.resolve(data)
                            return data
                        }
                        return Promise.resolve()
                    },
                    // 处理取消事件
                    handleClickCancel: (e) => {
                        const config = modalConfigs[modalName]
                        if (config?.cancel) {
                            return config.cancel(e)
                        }
                        return Promise.resolve()
                    }
                }

                // 构建传递给子组件的 props，合并一次避免重复
                const childProps = {
                    ...modalItem.props,
                    status: modalConfig.status,
                    ...modalConf
                }

                return h(
                    Modal,
                    {
                        key: modalName,
                        ...modalConfig
                    },
                    {
                        default: () => h(modalItem.component.value || modalItem.component, childProps)
                    }
                )
            })
        }
    }
})

// 生成唯一的模态框名称
function generateModalName() {
    return `${Date.now()}.${Math.floor(Math.random() * 1000000)}`
}

/**
 * 显示模态框
 * @param {Object} component - 要在模态框中显示的组件
 * @param {Object} props - 传递给组件的属性
 * @param {Object} modalConfig - 模态框配置
 * @param {Object} slots - 插槽配置
 * @returns {Object} 包含模态框操作方法的对象
 */
export function showModal(component, props = {}, modalConfig = {}, slots = {}) {
    const modalName = generateModalName()

    // 默认模态框配置
    const config = reactive({
        modelValue: true,
        ...props,
        ...modalConfig
    })

    // 创建 Promise 以支持 then/catch/finally 方法
    const promise = new Promise((resolve, reject) => {
        modalStore.modals.push({
            name: modalName,
            component: shallowRef(component),
            props,
            config,
            resolve,
            reject,
            slots,
            // 特殊配置
            fullscreen: modalConfig.fullscreen
        })
    })

    return {
        name: modalName,
        // 移除模态框的方法
        removeModal: () => removeModal(modalName),
        // Promise 方法
        then: promise.then.bind(promise),
        catch: promise.catch.bind(promise),
        finally: promise.finally.bind(promise)
    }
}

/**
 * 移除指定的模态框
 * @param {string} modalName - 模态框名称
 */
export function removeModal(modalName) {
    const modalIndex = modalStore.modals.findIndex(item => item.name === modalName)
    if (modalIndex !== -1) {
        const modal = modalStore.modals[modalIndex]
        // 设置 modelValue 为 false 触发关闭
        modal.config.modelValue = false
        // 从数组中移除
        modalStore.modals.splice(modalIndex, 1)
        // 清理配置
        delete modalConfigs[modalName]
    }
}

/**
 * 初始化模态框配置
 * @param {Object} config - 配置对象
 */
export function initModal(config) {
    const instance = getCurrentInstance()
    // 将配置存储到 modalConfigs 中，使用父组件的名称作为 key
    if (instance && instance.parent) {
    // 遍历 modalStore 查找匹配的组件
        for (const modalItem of modalStore.modals) {
            modalConfigs[modalItem.name] = config
        }
    }
}

// HMR 支持
if (import.meta.hot) {
    import.meta.hot.on('vite:beforeUpdate', (data = {}) => {
        if (data.updates) {
            // eslint-disable-next-line no-underscore-dangle
            const modalPaths = modalStore.modals.map(item => item.component.__file?.split('/src')[1])
            const updatedModals = data.updates.filter(item => modalPaths.includes(item.path?.split('/src')[1]))
            if (updatedModals.length) {
                location.reload()
            }
        }
    })
}