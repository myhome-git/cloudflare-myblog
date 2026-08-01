// @ts-ignore
const components = import.meta.glob('../views/**/*.vue')

function updateRouterRource(list: any, parentPath: string = '') {
  list.forEach((element: any) => {
    try {
      // 补全路由路径
      if (parentPath) {
        if (!element.path.startsWith('/')) {
          element.path = `/${element.path}`
        }
        element.path = `${parentPath}${element.path}`
        element.path = `${element.path}`.replace(/\/+$/, '')
      }

      /**
       * 修正错误
       * 如果出现两个一样的name名，那么就会报错，我们先用其它字段代替
       */
      // 将原始 name（中文标题）保存到 meta.title 中，供标签页显示
      if (element.name) {
        element.meta = { ...element.meta, title: element.name }
      }
      // @ts-ignore
      // eslint-disable-next-line no-underscore-dangle
      element.__name = element.name
      // @ts-ignore
      delete element.name
      if (element.source) {
        const componentPath = `../views${element.source}`
        const tempComponent = components[componentPath]
        if (tempComponent) {
          // 生成唯一的组件名称（基于路由路径），用于 KeepAlive 缓存匹配
          let name = element.path.replace(/[^a-zA-Z0-9]/g, '_')
          if (name.startsWith('_')) {name = name.substring(1)}
          const componentName = 'R_' + name
          // 包装异步组件加载函数，给组件赋予唯一名称
          element.component = () => {
            return tempComponent().then((comp: any) => {
              // console.log(comp.default)
              // 给组件添加 name 属性，支持 KeepAlive include 匹配
              comp.default.name = componentName
              // comp.default = Object.assign(comp.default, { name: componentName });
              return comp
            })
          }
        } else {
          console.error('未找到组件', componentPath)
        }
      }
      if (element.children) {
        updateRouterRource(element.children, element.path)
      }

    } catch {
      debugger
    }
  })
  return list
}

export default updateRouterRource