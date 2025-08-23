/**
 * 将 Canvas 图像转换为 File 对象
 *
 * @param {HTMLCanvasElement} canvas 要转换的 Canvas 元素
 * @param {string} fileName 文件名 (可选，默认为 "image.png")
 * @param {string} mimeType 文件类型 (可选，默认为 "image/png")
 * @param {number} quality 图片质量 (可选，仅对 JPEG/WebP 有效，0-1 之间，默认为 0.92)
 * @returns {Promise<File>}  一个 Promise，resolve 为 File 对象，reject 为错误
 */
async function canvasToFile(canvas, fileName, mimeType = 'image/png', quality = 1) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                return reject(new Error('Canvas to Blob failed'));
            }

            const file = new File([blob], fileName, { type: mimeType });
            resolve(file);
        }, mimeType, quality);
    });
}


async function processCanvas(canvas) {
    try {
        const file = await canvasToFile(canvas, 'myImage.png');
        console.log('文件已创建:', file);
        // 在这里可以使用 file 对象做其他操作，例如上传到服务器
    } catch (error) {
        console.error('创建文件失败:', error);
    }
}

export default canvasToFile