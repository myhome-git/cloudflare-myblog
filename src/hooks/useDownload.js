import axios from 'axios'

export async function handleDownLoad(url, type){
    if(type === 'get-a'){
        await handleExport(url)
    }else if(type === 'get-blob'){
        await handleExport(url)
    }else{
        await handleDownloadFile(url)
    }
    return Promise.resolve()
}

/**
 * 适合大文件下载，直连下载
 * @param {*} url
 */
function handleDownloadFile(url){
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

/**
 * 下载文件流转成blob数据再下载
 * @param {*} url
 */
async function handleExport(url){
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'blob' // 设置响应类型为 blob
        })
        await handleDownloadBlob(response)
    } catch (error) {
        console.error('下载文件时出错:', error)
    }
}

export async function handleDownloadBlob(response){
    try{
    // 创建一个 Blob 对象
        const mimeType = response.headers['mime-type']
        const blob = new Blob([response.data], { type: mimeType || 'application/octet-stream' })
        // 创建一个下载链接
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        // 设置文件名
        const disposition = response.headers['content-disposition']
        let filename = 'download'
        if (disposition && disposition.indexOf('attachment') !== -1) {
            filename = disposition.replace(/attachment\;\s+filename=/g, '')
            // const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
            // const matches = filenameRegex.exec(disposition)
            // if (matches !== null && matches[1]) {
            //   filename = matches[1].replace(/['"]/g, '')
            // }
        }
        link.download = decodeURIComponent(filename)
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        // 释放链接
        URL.revokeObjectURL(link.href)
        document.body.removeChild(link)
    }catch(error){
        console.error('下载文件时出错:', error)
    }
}

export default { handleDownLoad, handleDownloadBlob }