import { message } from 'ant-design-vue'
// const key = 'updatable'
const alertMessageError = (text, duration = 1) => {
    const key = `${Date.now()}`
    message.error({ content: text, key, duration: duration })
}

//引入axios
import axios from 'axios'
// 创建axios对象
const service = axios.create()

// 请求拦截器
service.interceptors.request.use(config => {
    // console.log(`收到请求拦截`,config);
    // setTimeout(() => {
    //     message.loading({ content: 'Loading...', key, duration: 1 })
    // }, 50)
    return config
}, (error) => {
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use((response) => {
    // Object.assign(response.config.headers, { reqEndTime: Date.now() })
    if (response.status === 200) {
        return response.config.responseCall ? response.config.responseCall(response) : response.data
    }
    console.log(response)
    const message = `Error：${response.status}，${response.statusText}`
    throw new Error(message)
}, (error) => {
    // Object.assign(error.config.headers, {
    //     reqEndTime: Date.now(),
    //     reqTimeConsuming: Date.now() - error.config.headers.reqStartTime
    // })
    // if(['put', 'delete'].includes(error.config.method)){
    //     throw error
    // }
    if (error.status === 401) {
        location.href = '/login'
        return
    }
    // 判断服务器是否有返回信息
    if (error.response) {
        if (error.response.data) {
            try {
                const data = error.response.data
                if (data && data.message) {
                    alertMessageError(data.message, 5)
                }
            // eslint-disable-next-line no-unused-vars
            } catch (e) {
                console.error(error)
            }
        }
        return Promise.reject(error.response)
    }
    const message = `Error：${error.status}，${error.message}`
    alertMessageError(message, 1)
    return Promise.reject(error)
})

const requestWithTiming = (config) => {
    const originalPromise = service(config)
    return originalPromise
}

// 导出代理函数作为默认导出
export default requestWithTiming
