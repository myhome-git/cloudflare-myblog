import { message } from 'ant-design-vue'
const key = 'updatable'
const alertMessageError = (text, duration = 1) => {
    message.error({ content: text, key, duration: duration })
}

//引入axios
import axios from 'axios'
// 创建axios对象
const service = axios.create()

// 请求拦截器
service.interceptors.request.use(config => {
    // console.log(`收到请求拦截`,config);
    setTimeout(() => {
        message.loading({ content: 'Loading...', key, duration: 1 })
    }, 1)
    // Object.assign(config.headers, {
    //     "token": sessionStorage.getItem("token")
    // });
    config.startTime = Date.now()
    return config
}, (error) => {
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use((response) => {
    if (response.status === 200) {
        return response.data
    }
    const message = `Error：${response.status}，${response.statusText}`
    throw new Error(message)
}, (error) => {
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
            } catch (e) {
                console.error(e)
            }
        }
        return Promise.reject(error.response)
    }
    const message = `Error：${error.status}，${error.message}`
    alertMessageError(message, 5)
    return Promise.reject(error)
})

const requestWithTiming = (config) => {
    const originalPromise = service(config)
    return originalPromise
}

// 导出代理函数作为默认导出
export default requestWithTiming
