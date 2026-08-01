export function useVModel(props, propName, emit){
    const model = computed({
        get() {
            try {
                const proxy = new Proxy(props[propName], {
                    get(target, key){
                        return Reflect.get(target, key)
                    },
                    set(target, key, value){
                        Reflect.set(target, key, value)
                        emit(`update:${propName}`, target)
                        return true
                    }
                })
                return proxy
            } catch (error) {
                console.error(error)
                debugger
            }
        },
        set(value){
            emit(`update:${propName}`, value)
        }
    })
    return model
}
export default { useVModel }