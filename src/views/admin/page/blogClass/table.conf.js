import SystemConfig from "@/SystemConfig.js";
const apiURL = `/api/admin/blogClass`;
const confPage = SystemConfig.page;
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
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
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
];
export default { apiURL, uuidName, tableColumns, confPage };