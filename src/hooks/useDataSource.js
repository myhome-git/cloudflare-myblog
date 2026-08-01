import { reactive } from 'vue'
import api from './useDataSourceApi'
export default function(config = {}) {
  const dataSource = reactive({})
  const allConfig = {}

  const result = dataSourceDispatch(config)
  function dataSourceDispatch(config = {}) {
    const pp = []
    Object.keys(config).map((name) => {
      const value = config[name]
      allConfig[name] = value
      const type = typeof value
      if(type === 'string' || type instanceof Array){
        dataSource[name] = value
      }else if(type === 'object'){
        dataSource[name] = []
      }
      pp.push(
        getRequest(value).then((res = []) => {
          dataSource[name] = res
        })
      )
    })
    return Promise.all(pp).then(() => {
      return dataSource
    })
  }

  function getRequest(option) {
    if (option.api) {
      return option.api(option)
    } else if(option.type === 'lov'){
      return api[option.type]({ data: option.params }).then((res) => {
        return res || []
      })
    } else if(option.type === 'lovHeader'){
      return api[option.type]({ data: option.params }).then((res) => {
        return res.content || {}
      })
    }
    return Promise.resolve(option || [])
  }

  const returnData = {
    dataSource,
    dataSourceDispatch,
    then(fn) {
      return result.then(fn)
    },
    refashDataSource(names) {
      if(typeof names === 'string'){
        return getRequest(allConfig[names])
      }else if(names instanceof Array) {
        const pp = []
        names.forEach((item) => pp.push(getRequest(item)))
        return Promise.all(pp).then(() => {
          return dataSource
        })
      }
    }
  }
  return returnData
}