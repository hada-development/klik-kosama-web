import { request } from 'umi';


export async function getAppSetting(options?: { [key: string]: any }) {
    return request('/api/web/test', {
        method: 'GET',
        ...(options || {}),
    });
}