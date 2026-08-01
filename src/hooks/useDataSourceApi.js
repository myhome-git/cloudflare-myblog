import { createApi } from '@/hooks/useApi'
export default createApi({
    lovHeader: '/api/admin/lov/lov-header',
    lov: '/api/admin/lov/lov-detail'
})
