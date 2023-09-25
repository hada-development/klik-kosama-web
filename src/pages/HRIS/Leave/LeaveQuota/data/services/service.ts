import { formatTableParams } from '@/common/utils/utils';
import { request } from 'umi';

export async function getLeaveQuota(params: any, options?: { [key: string]: any }) {
  try {
    const formattedParams = formatTableParams(params);
    let response = await request('/api/web/hr/leave-quota', {
      method: 'GET',
      params: {
        ...formattedParams,
      },
      ...(options || {}),
    });
    return {
      current_page: response.current_page,
      data: response.data,
      total: response.total,
    };
  } catch (e) {
    throw e;
  }
}

export async function addLeaveQuota(data?: { [key: string]: any }) {
  return request('/api/web/hr/leave-quota', {
    method: 'POST',
    data: data,
  });
}

export async function editLeaveQuota(id?: number, data?: { [key: string]: any }) {
  return request(`/api/web/hr/leave-quota/${id}`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteLeaveQuota(id?: number) {
  return request(`/api/web/hr/leave-quota/${id}`, {
    method: 'DELETE',
  });
}
