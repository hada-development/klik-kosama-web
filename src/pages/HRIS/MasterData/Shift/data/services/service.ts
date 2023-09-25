import { formatTableParams } from '@/common/utils/utils';
import { request } from 'umi';

export async function getShift(params: any, options?: { [key: string]: any }) {
  try {
    const formattedParams = formatTableParams(params);
    let response = await request('/api/web/hr/shift', {
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

export async function addShift(data?: { [key: string]: any }) {
  return request('/api/web/hr/shift', {
    method: 'POST',
    data: data,
  });
}

export async function editShift(id?: number, data?: { [key: string]: any }) {
  return request(`/api/web/hr/shift/${id}`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteShift(id?: number) {
  return request(`/api/web/hr/shift/${id}`, {
    method: 'DELETE',
  });
}
