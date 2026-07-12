import SystemConfig from "@/SystemConfig";
const apiURL = `/api/admin/database`;
const uuidName = "id";
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
        title: '备份名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '备份大小',
        dataIndex: 'size',
        key:'size'
    },
    {
        title: 'MD5',
        dataIndex: 'md5',
        key:'md5'
    },
    {
        title: '备份时间',
        dataIndex: 'create_time',
        key: 'create_time',
    },
    {
        title: '操作',
        dataIndex: 'operation',
    },
];
export default { apiURL, uuidName, tableColumns };