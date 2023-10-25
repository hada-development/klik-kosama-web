import { formatTableParams } from '@/common/utils/utils';
import { request } from 'umi';

export async function getSupplier(params: any, options?: { [key: string]: any }) {
  try {
    const formattedParams = formatTableParams(params);
    let response = await request('/api/web/store/supplier', {
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

export async function addSupplier(data?: { [key: string]: any }) {
  return request('/api/web/store/supplier', {
    method: 'POST',
    data: data,
  });
}

export async function editSupplier(id?: number, data?: { [key: string]: any }) {
  return request(`/api/web/store/supplier/${id}`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteSupplier(id?: number) {
  return request(`/api/web/store/supplier/${id}`, {
    method: 'DELETE',
  });
}
