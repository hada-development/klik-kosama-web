import { formatTableParams } from '@/common/utils/utils';
import { request } from 'umi';

export async function getVoucher(params: any, options?: { [key: string]: any }) {
  try {
    const formattedParams = formatTableParams(params);
    let response = await request('/api/web/store/voucher', {
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

export async function addVoucher(data?: { [key: string]: any }) {
  return request('/api/web/store/voucher', {
    method: 'POST',
    data: {
      ...data,
      status: 'published',
    },
  });
}

export async function editVoucher(id?: number, data?: { [key: string]: any }) {
  return request(`/api/web/store/voucher/${id}`, {
    method: 'PUT',
    data: {
      ...data,
      status: 'published',
    },
  });
}

export async function deleteVoucher(id?: number) {
  return request(`/api/web/store/voucher/${id}`, {
    method: 'DELETE',
  });
}

export async function deleteBatchVoucher(ids: number[]) {
  return request(`/api/web/store/voucher`, {
    method: 'DELETE',
    data: {
      ids: ids,
    },
  });
}
