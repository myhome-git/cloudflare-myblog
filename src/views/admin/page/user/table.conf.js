import SystemConfig from "@/SystemConfig";
const apiURL = `/api/admin`;
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
        title: '登陆账户',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: '登陆密码',
        dataIndex: 'password',
        key: 'password',
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
export default { apiURL, uuidName, tableColumns };