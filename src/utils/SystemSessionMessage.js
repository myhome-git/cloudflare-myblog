// 创建消息通道
const bc = new BroadcastChannel(location.origin);

// 监听消息
const handleBindSystemMessage = (event) => {
    // console.log('收到消息:', event.data);
    switch (event.data.type) {
        // 处理不同类型的消息
        case 'req.isLogin':
            if (sessionStorage.getItem("username")) {
                handleSendSystemMessage("resp.isLogin", { ...sessionStorage });
            }
            break;
        case 'resp.isLogin':
            handleRespIsLogin(event.data.data);
            break;
        default:
            break;
    }
}

// 错误处理
const handleBindSystemMessageError = (error) => {
    console.error('消息传输错误:', error);
}
export const initHandleSystemMessage = () => {
    bc.addEventListener('message', handleBindSystemMessage);
    bc.addEventListener('messageerror', handleBindSystemMessageError);
}

// 关闭通道
export const clearHandleCloseChannel = () => {
    bc.close();
    bc.removeEventListener('message', handleBindSystemMessage);
    bc.removeEventListener('messageerror', handleBindSystemMessageError);
}

function handleRespIsLogin(data) {
    const value = data;
    if (value && value.username) {
        if (sessionStorage.getItem("username") !== value["username"]) {
            sessionStorage.clear();
            Object.keys(value).forEach(key => {
                sessionStorage.setItem(key, `${value[key]}`);
            });
        }
    }
}

export const handleSendSystemMessage = (type, data) => {
    bc.postMessage({ type, data });
}
