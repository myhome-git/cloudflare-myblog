import { computed } from 'vue'
export default function useStorage(config = {}) {

  Object.keys(config).forEach((item) => {
    setValue(item, config[item])
  })

  const defaultConf = {
    'sessionStorage': sessionStorage,
    'localStorage': localStorage
  }

  let defaultObj = defaultConf['sessionStorage']
  function chenage(key){
    defaultObj = defaultConf[key]
    return this
  }
  function setValue(key, value){
    defaultObj.setItem(key, value)
    return this
  }

  function getValue(key){
    return defaultObj.getItem(key)
  }

  function removeValue(key){
    defaultObj.removeItem(key)
    return this
  }

  function getValueAll(){
    return defaultConf
  }

  // token

  function setTokenValue(value){
    defaultConf['sessionStorage'].setItem('token', value)
    return this
  }
  function getTokenValue(){
    return defaultConf['sessionStorage'].getItem('token')
  }

  const user = computed(() => getValue('user'))
  const system = computed(() => getValue('system'))
  const theme = computed(() => getValue('theme'))
  const token = computed(() => getValue('token'))

  return {
    system,
    user,
    theme,
    token,
    chenage,
    setValue,
    getValue,
    removeValue,
    getValueAll,
    setTokenValue,
    getTokenValue
  }
}
