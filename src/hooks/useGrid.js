import { unref } from 'vue'
export default function useGrid(option){
    if(!option.ref || !option.tabKey){
        throw new Error('is not ref or tabKey is not')
    }
    const tabKey = option.tabKey
    const gridRef = option.ref
    const getTable = () => {
        try{
            return unref(gridRef).getTable(tabKey)
        } catch {
            return null
        }
    }
    const checkboxData = computed(() => {
        const t = getTable()?.ref
        return t ? (t.getCheckboxRecords ? t.getCheckboxRecords() : []) : []
    })
    const checkRadioData = computed(() => {
        const t = getTable()?.ref
        return t ? (t.getRadioRecord ? t.getRadioRecord() : null) : null
    })
    const tableData = computed(() => {
        const t = getTable()?.ref
        return t ? t.data : null
    })
    const reload = function(){
        return getTable()?.reload()
    }

    return {
        getTable,
        reload,
        checkboxData,
        checkRadioData,
        tableData
    }
}