import { formatTableParams } from '@/common/utils/utils';
import { request } from 'umi';

export async function getSavingTransaction(
  params: any,
  options?: { [key: string]: any },
): Promise<{
  current_page: number;
  data: SavingTransactionFeature.SavingTransactionListItem[];
  total: number;
}> {
  try {
    const formattedParams = formatTableParams(params);

    let response = await request('/api/web/coop/saving/transaction', {
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

export async function addSavingTransaction(data?: { [key: string]: any }) {
  return request('/api/web/coop/saving/transaction', {
    method: 'POST',
    data: data,
  });
}

export async function editSavingTransaction(id?: number, data?: { [key: string]: any }) {
  return request(`/api/web/coop/saving/transaction/${id}`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteSavingTransaction(id?: number) {
  return request(`/api/web/coop/saving/transaction/${id}`, {
    method: 'DELETE',
  });
}
