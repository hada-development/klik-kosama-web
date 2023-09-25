import { formatTableParams } from '@/common/utils/utils';
import { request } from 'umi';

export async function getCompany(params: any, options?: { [key: string]: any }) {
  try {
    const formattedParams = formatTableParams(params);
    let response = await request('/api/web/hr/company', {
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

export async function addCompany(data?: { [key: string]: any }) {
  return request('/api/web/hr/company', {
    method: 'POST',
    data: data,
  });
}

export async function editCompany(id?: number, data?: { [key: string]: any }) {
  return request(`/api/web/hr/company/${id}`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteCompany(id?: number) {
  return request(`/api/web/hr/company/${id}`, {
    method: 'DELETE',
  });
}
