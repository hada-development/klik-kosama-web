import { formatTableParams } from '@/common/utils/utils';
import { request } from 'umi';
import { VoluntaryWithdrawSubmissionDetail, VoluntaryWithdrawSubmissionList } from './data';

const baseUrl = '/api/web/coop/submission/voluntary-withdraw';

export async function getVoluntaryWithdrawSubmission(
  params: any,
  options?: { [key: string]: any },
): Promise<VoluntaryWithdrawSubmissionList> {
  try {
    const formattedParams = formatTableParams(params);

    let response = await request(baseUrl, {
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

export async function getVoluntaryWithdrawSubmissionDetail(
  id: number,
): Promise<VoluntaryWithdrawSubmissionDetail> {
  const response = await request(`${baseUrl}/${id}`, {
    method: 'GET',
  });
  return response.data;
}

export async function editVoluntaryWithdraw(id?: number, data?: { [key: string]: any }) {
  return request(`${baseUrl}/${id}`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteSavingTransaction(id?: number) {
  return request(`/api/web/coop/saving/transaction/${id}`, {
    method: 'DELETE',
  });
}
