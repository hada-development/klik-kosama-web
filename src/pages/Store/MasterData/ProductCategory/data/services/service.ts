import { formatTableParams } from '@/common/utils/utils';
import { request } from 'umi';

export async function getProductCategory(params: any, options?: { [key: string]: any }) {
  try {
    const formattedParams = formatTableParams(params);
    let response = await request('/api/web/store/product-category', {
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

export async function addProductCategory(data?: { [key: string]: any }) {
  return request('/api/web/store/product-category', {
    method: 'POST',
    data: data,
  });
}

export async function editProductCategory(id?: number, data?: { [key: string]: any }) {
  return request(`/api/web/store/product-category/${id}`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteProductCategory(id?: number) {
  return request(`/api/web/store/product-category/${id}`, {
    method: 'DELETE',
  });
}
