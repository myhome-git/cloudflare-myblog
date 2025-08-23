
/**
 * 判断对象类型
 */
export const getType = (obj: any) => {
    // Object,Array,Date,RegExp,Function,Null,Undefined,Number,String,Boolean
    return Object.prototype.toString.call(obj).slice(8, -1);
}

/**
 * 重置对象属性
 */
export const resetObject = (obj: object) => {
    let isRun = true;
    Object.keys(obj).forEach((key, index) => {
        if (obj.hasOwnProperty(key)) {
            const type = getType(key);
        }
    });
}

Object.defineProperty(Array.prototype, 'clear', {
    value: function() {
        this.length = 0;
        this.splice(0, this.length);
        return this;
    },
    enumerable: false,  // 不可枚举，避免影响for...in循环
    writable: true,     // 可写
    configurable: true // 可配置
});
