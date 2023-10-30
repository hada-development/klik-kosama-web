import { ResponseData } from '@/common/data/data';
import { request } from 'umi';
import { POSMember, POSPaymentMethod, POSProduct, POSTransaction, POSVoucher } from './data';

export async function getProduct(
  query: string,
  param: string,
): Promise<ResponseData<POSProduct[]>> {
  // TODO: Change store_id
  const store_id = 1;
  const url = '/api/web/pos/products';
  var searchParam: { [key: string]: string } = {};
  searchParam[param] = query;
  return request(url, {
    method: 'GET',
    params: {
      store_id: store_id,
      ...searchParam,
    },
  });
}

export async function getMember(query: string): Promise<ResponseData<POSMember[]>> {
  const url = '/api/web/pos/members';
  return request(url, {
    method: 'GET',
    params: {
      term: query,
    },
  });
}

export async function getVouchers(userId: number): Promise<ResponseData<POSVoucher[]>> {
  const url = '/api/web/pos/vouchers';
  return request(url, {
    method: 'GET',
    params: {
      user_id: userId,
    },
  });
}

export async function getPaymentMethod(): Promise<ResponseData<POSPaymentMethod[]>> {
  const url = '/api/web/pos/payment-methods';
  return request(url, {
    method: 'GET',
  });
}

export async function storeTransaction(data?: {
  [key: string]: any;
}): Promise<ResponseData<POSTransaction>> {
  const url = '/api/web/pos/transaction';
  return request(url, {
    method: 'POST',
    data: data,
  });
}
