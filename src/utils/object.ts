
/**
 * 判断对象类型
 */
export const getType = (obj: any) => {
    // Object,Array,Date,RegExp,Function,Null,Undefined,Number,String,Boolean
    return Object.prototype.toString.call(obj).slice(8, -1)
}

/**
 * 重置对象属性
 */
export const resetObject = (obj: any) => {
    Object.keys(obj).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj[key] = undefined
        }
    })
    return obj
}

Object.defineProperty(Array.prototype, 'clear', {
    value: function() {
        this.splice(0, this.length)
        return this
    },
    enumerable: false, // 不可枚举，避免影响for...in循环
    writable: true, // 可写
    configurable: true // 可配置
})
