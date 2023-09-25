import { formatTableParams } from '@/common/utils/utils';
import { request } from 'umi';

export async function getPositionLevel(params: any, options?: { [key: string]: any }) {
  try {
    const formattedParams = formatTableParams(params);
    let response = await request('/api/web/hr/position-level', {
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

export async function addPositionLevel(data?: { [key: string]: any }) {
  return request('/api/web/hr/position-level', {
    method: 'POST',
    data: data,
  });
}

export async function editPositionLevel(id?: number, data?: { [key: string]: any }) {
  return request(`/api/web/hr/position-level/${id}`, {
    method: 'PUT',
    data: data,
  });
}

export async function deletePositionLevel(id?: number) {
  return request(`/api/web/hr/position-level/${id}`, {
    method: 'DELETE',
  });
}
