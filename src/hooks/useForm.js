export default function(config = {}) {
  let formRef = ref()
  if (config.ref || config.gridRef) {
    formRef = config.gridRef || config.ref
  }

  function getForm(){
    return unref(formRef)
    // return unref(unref(formRef).formRef)
  }

function validate() {
  return getForm()?.validate()
}

  function clearValidate() {
    return getForm()?.clearValidate()
  }
  return {
    formRef,
    validate,
    clearValidate
  }
}
