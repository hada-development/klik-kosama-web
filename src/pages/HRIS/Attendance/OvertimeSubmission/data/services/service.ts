import { formatTableParams } from '@/common/utils/utils';
import { request } from 'umi';

export async function getOvertimeSubmission(params: any, options?: { [key: string]: any }) {
  try {
    const formattedParams = formatTableParams(params);
    let response = await request('/api/web/hr/overtime-submission', {
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

export async function addOvertimeSubmission(data?: { [key: string]: any }) {
  return request('/api/web/hr/overtime-submission', {
    method: 'POST',
    data: data,
  });
}

export async function editOvertimeSubmission(id?: number, data?: { [key: string]: any }) {
  return request(`/api/web/hr/overtime-submission/${id}`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteOvertimeSubmission(id?: number) {
  return request(`/api/web/hr/overtime-submission/${id}`, {
    method: 'DELETE',
  });
}
