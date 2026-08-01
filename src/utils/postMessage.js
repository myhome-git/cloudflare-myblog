export default function PostMessage(callbackMessageIn) {
    // 创建消息通道
    const bc = new BroadcastChannel(location.origin)

    // 监听消息
    const handleBindSystemMessage = (event) => {
        if(callbackMessageIn){
            callbackMessageIn(event)
        }
    }

    // 错误处理
    const handleBindSystemMessageError = (error) => {
        console.error('消息传输错误:', error)
    }

    const initHandleSystemMessage = () => {
        bc.addEventListener('message', handleBindSystemMessage)
        bc.addEventListener('messageerror', handleBindSystemMessageError)
    }

    // 关闭通道
    const clearHandleCloseChannel = () => {
        bc.close()
        bc.removeEventListener('message', handleBindSystemMessage)
        bc.removeEventListener('messageerror', handleBindSystemMessageError)
    }

    const handleSendSystemMessage = (type, data) => {
        bc.postMessage({ type, data })
    }

    return {
        initHandleSystemMessage,
        clearHandleCloseChannel,
        handleSendSystemMessage
    }
}