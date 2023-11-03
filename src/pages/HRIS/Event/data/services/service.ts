import { formatTableParams, requestTableData } from '@/common/utils/utils';
import { request } from 'umi';

export async function getEvent(params: any, options?: { [key: string]: any }) {
  return requestTableData('/api/web/hr/event', params, options);
  try {
    const formattedParams = formatTableParams(params);
    let response = await request('/api/web/hr/event', {
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

export async function addEvent(data?: { [key: string]: any }) {
  return request('/api/web/hr/event', {
    method: 'POST',
    data: data,
  });
}

export async function editEvent(id?: number, data?: { [key: string]: any }) {
  return request(`/api/web/hr/event/${id}`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteEvent(id?: number) {
  return request(`/api/web/hr/event/${id}`, {
    method: 'DELETE',
  });
}
