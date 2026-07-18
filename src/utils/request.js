import { is } from '@babel/types';
import { message } from 'ant-design-vue';
const key = 'updatable';
const alertMessageError = (text, duration = 1) => {
    message.error({ content: text, key, duration: duration });
};
const warning = (text) => {
    message.warning(text);
};

//引入axios
import axios from "axios";
// 创建axios对象
const service = axios.create();

// 请求拦截器
service.interceptors.request.use(config => {
    // console.log(`收到请求拦截`,config);
    setTimeout(() => {
        message.loading({ content: 'Loading...', key, duration: 1 });
    }, 1);
    Object.assign(config.headers, {
        "token": sessionStorage.getItem("token")
    });
    config.startTime = Date.now();
    return config;
}, (error) => {
    Promise.reject(error);
})

// 响应拦截器
service.interceptors.response.use((response) => {
    if (response.status === 200) {
        return response.data;
    }
    const message = `Error：${response.status}，${response.statusText}`;
    throw new Error(message);
}, (error) => {
    if (error.status === 401) {
        location.href = "/login";
        return;
    }
    // 判断服务器是否有返回信息
    if (error.response) {
        if (error.response.data) {
            try {
                const data = error.response.data;
                if (data && data.message) {
                    alertMessageError(data.message, 5);
                }
            } catch (e) {
                console.error(error);
            }
        }
        return Promise.reject(error.response);
    }
    const message = `Error：${error.status}，${error.message}`;
    alertMessageError(message, 5);
    return Promise.reject(error);
});

const requestWithTiming = (config) => {
    // 1. 在config中添加startTime
    const startTime = Date.now();

    // 2. 调用原始的service函数，获取原始Promise
    const originalPromise = service(config);
    let requestTiming = null;

    /**
     * 辅助函数：计算时序信息，并将其注入到原始数据中。不执行任何延迟。
     * @param {Object} data - 原始的响应数据或错误数据 (axios response 或 Error 对象)
     * @param {boolean} [isError=false] - 标识是否为错误处理路径
     * @returns {Object} - 包含时序信息的增强数据
     */
    const calculateAndInjectTimingInfo = (data, isError = false) => {
        const endTime = Date.now();
        const duration = endTime - startTime; // 实际HTTP请求耗时
        const minDuration = 500; // 这个值现在主要用于计算 delayAdded
        let delay = Math.max(0, minDuration - duration); // 计算出的额外延迟时间（即使不执行）
        delay = delay < 0 ? 0 : delay; // 确保 delay >= 0

        // 构造包含时序信息的新对象
        const timingInfo = {
            startTime: startTime,
            endTime: endTime,
            duration: duration,      // 实际请求耗时
            minDuration: minDuration, // 设定的最小持续时间
            delayAdded: delay,        // 计算出的需要额外添加的延迟时间
            isError: isError,
            message : ""
        };
        try {
            Object.assign(timingInfo, { message: data.message });
            Object.assign(timingInfo, { message: data.data.message });
        } catch (e) {
            
        }

        originalPromise.__timeInfo = timingInfo; // 注入时序信息到原始Promise对象上
        // 将时序信息添加到原始数据中
        const augmentedData = {
            ...data,
            requestTiming: timingInfo // 添加时序信息
        };

        // 重要的：这里不再有 setTimeout 或 Promise 包装，直接返回增强的数据
        return augmentedData;
    };

    // 3. 链式调用 then 和 catch，对响应/错误进行处理并将时序数据注入
    return originalPromise
        .then(response => {
            // 当原始请求成功时，调用辅助函数处理并返回增强后的响应数据
            // .then 返回什么，下一个 .then 就会收到什么
            const augmentedData = calculateAndInjectTimingInfo(response, false);
            return augmentedData;
        })
        .catch(error => {
            // 当原始请求失败时，调用辅助函数处理，得到增强后的错误对象
            const augmentedData = calculateAndInjectTimingInfo(error, true);

            // 重要的：为了保持 Promise 链的错误状态，我们必须再次拒绝这个增强后的错误
            // 如果这里直接返回 augmentedError，外部的 .catch 就不会被触发，而是会进入 .then
            return Promise.reject(augmentedData);
        });
};

// 导出代理函数作为默认导出
export default requestWithTiming;
