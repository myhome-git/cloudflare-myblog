function setWidth(column, width) {
  column.width = unref(width) !== undefined ? unref(width) : 150
  column.minWidth = unref(width) === 0 ? 0 : 150
  if (!unref(width)) {
    column.show = false
  }
}
export default function(
  config = { remove: true, reload: true, copyNeedSetEdit: true },
  slots,
  loadCall
) {
  const actionColumn = reactive({
    title: '操作',
    field: '_action',
    fixed: 'right',
    width: 150,
    minWidth: 150,
    show: true
  })
  const callBack = typeof slots === 'function' ? slots : loadCall
  callBack && callBack({
    column: actionColumn,
    setColumnWidth(width) {
        setWidth(actionColumn, width)
      },
   })
  return Object.assign(
    {
      slots: {
        default(tableSlotParams) {
          const { row, rowIndex } = tableSlotParams
          return h(
            resolveComponent('c-table-action'),
            Object.assign(
              {
                row,
                rowIndex,
                slotsParams: tableSlotParams
              },
              typeof config === 'function' ? config(tableSlotParams) : config
            ),
            typeof slots === 'function' ? {} : slots
          )
        }
      }
    },
    actionColumn
  )
}
