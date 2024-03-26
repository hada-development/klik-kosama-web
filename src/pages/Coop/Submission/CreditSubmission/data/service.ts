import { ResponseData } from '@/common/data/data';
import { formatTableParams } from '@/common/utils/utils';
import { request } from 'umi';
import {
  Calculation,
  CreditSubmissionSubmissionDetail,
  CreditSubmissionSubmissionList,
  InstallmentTerm,
} from './data';

const baseUrl = '/api/web/coop/submission/credit';

export async function getCreditSubmissionSubmission(
  params: any,
  options?: { [key: string]: any },
): Promise<CreditSubmissionSubmissionList> {
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

export async function getCreditSubmissionSubmissionDetail(
  id: number,
): Promise<CreditSubmissionSubmissionDetail> {
  const response = await request(`${baseUrl}/${id}`, {
    method: 'GET',
  });
  return response.data;
}

export async function editCreditSubmission(id?: number, data?: { [key: string]: any }) {
  return request(`${baseUrl}/${id}`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteCreditSubmission(id?: number) {
  return request(`${baseUrl}/${id}`, {
    method: 'DELETE',
  });
}

export async function getAvailableInstalmentTerms(
  id: number,
  amount: number,
): Promise<ResponseData<InstallmentTerm[]>> {
  return request(`${baseUrl}/${id}/terms`, {
    method: 'GET',
    params: {
      amount: amount,
    },
  });
}

export async function getCalculation(
  id: number,
  buy_price: number,
  installment_term: number,
): Promise<ResponseData<Calculation>> {
  return request(`${baseUrl}/${id}/calculation`, {
    method: 'GET',
    params: {
      buy_price: buy_price,
      installment_term: installment_term,
    },
  });
}
