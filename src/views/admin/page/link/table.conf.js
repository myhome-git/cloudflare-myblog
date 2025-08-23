import SystemConfig from "@/SystemConfig";
const confHost = SystemConfig.host;
const apiURL = `${confHost}/api/admin/link`;
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
        title: '打开方式',
        dataIndex: 'target',
        key: 'target',
    },
    {
        title: '地址',
        dataIndex: 'link_url',
        key: 'link_url',
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
export default { confHost, apiURL, uuidName, tableColumns, confPage };