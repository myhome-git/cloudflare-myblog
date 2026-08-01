import { unref, computed } from 'vue'
export default function useTable(option){
    if(!option.ref){
        throw new Error('is not ref')
    }
    const tabKey = option.tabKey
    let tableRef = ref(null)
    if(!tabKey){
        tableRef = option.ref
    }else{
        Object.assign(tableRef.value, { [tabKey]: option.ref })
    }
    const getTable = () => {
        try{
            const sourceTable = tabKey ? unref(tableRef)[tabKey] : unref(tableRef)
            return sourceTable
        } catch {
            return null
        }
    }
    const checkboxData = computed(() => {
        const table = getTable()
        if(table && table.ref){
            return unref(table.ref).getCheckboxRecords()
        }
        return []
    })
    const checkRadioData = computed(() => {
        const table = getTable()
        if(table && table.ref){
            return unref(table.ref).getRadioRecord()
        }
        return null
    })
    const reload = function(){
        const table = getTable()
        if(table){
            return table.reload()
        }
        return () => {}
    }

    return {
        getTable,
        reload,
        checkboxData,
        checkRadioData
    }
}