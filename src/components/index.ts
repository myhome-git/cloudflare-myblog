import { dynamicApp } from '@/hooks/useModal'

// import './style.scss'
export function setupComponents(app: any) {
    // 注册动态模态框组件
    app.component('DynamicApp', dynamicApp)
}

export default setupComponents
