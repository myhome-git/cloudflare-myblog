import SystemConfig from '@/SystemConfig'
const apiURL = '/api/admin/notepad'
const confPage = SystemConfig.page
const uuidName = 'id'
const tableColumns = [
    {
        title: '序号',
        dataIndex: 'row_num',
        key: 'row_num',
    },
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '内容',
        dataIndex: 'jianshu',
        key: 'jianshu',
    },
    {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
    },
    {
        title: '操作',
        dataIndex: 'operation',
    },
]
export default { apiURL, uuidName, tableColumns, confPage }