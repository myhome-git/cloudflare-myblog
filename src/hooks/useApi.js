import useRequest from './useRequest'
import{ getType } from '@/utils/utils'
export function createApi(option){
    const req = {}
    const methods = ['get', 'post', 'put', 'delete']
    Object.keys(option).forEach((key) => {
        req[key] = (ops) => {
            const value = option[key]
            const defaultConf = {
                url: value,
                method: methods.includes(key) ? key : 'post'
            }
            if(getType(value) === 'object'){
                Object.assign(defaultConf, value, ops)
            }
            Object.assign(defaultConf, ops)
            return useRequest(defaultConf)
        }
    })
    return req
}
export default { createApi }