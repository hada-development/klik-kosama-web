import { ResponseData } from '@/common/data/data';
import { formatDateTime } from '@/common/utils/utils';
import { request } from 'umi';
import {
  AppOrder,
  AppOrderListItem,
  POSMember,
  POSPaymentMethod,
  POSProduct,
  POSTransaction,
  POSVoucher,
} from './data';

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

// POS APP ORDER
export async function getNewAppOrder(): Promise<ResponseData<number>> {
  const url = '/api/web/pos/app-order/new';
  return request(url, {
    method: 'GET',
  });
}
export async function getAppOrder(): Promise<ResponseData<AppOrderListItem[]>> {
  const url = '/api/web/pos/app-order';
  return request(url, {
    method: 'GET',
  });
}

export async function getAppOrderDetail(id: number): Promise<ResponseData<AppOrder>> {
  const url = '/api/web/pos/app-order/' + id;
  return request(url, {
    method: 'GET',
  });
}

export async function updateAppOrder(
  id: number,
  data: { [key: string]: any },
): Promise<ResponseData<AppOrder>> {
  const url = '/api/web/pos/app-order/' + id;
  return request(url, {
    method: 'PUT',
    data: data,
  });
}
// ===============================

export async function storeTransaction(data?: {
  [key: string]: any;
}): Promise<ResponseData<POSTransaction>> {
  const url = '/api/web/pos/transaction';
  return request(url, {
    method: 'POST',
    data: data,
  });
}

export async function voidTransaction(trxId: number): Promise<ResponseData<any>> {
  const url = `/api/web/pos/transaction/${trxId}`;
  return request(url, {
    method: 'DELETE',
  });
}

export async function getTodayTransaction(): Promise<ResponseData<POSTransaction[]>> {
  // Todo Store Id
  const store_id = 1;

  const url = '/api/web/pos/transaction';
  const params = {
    'order[created_at]': 'desc',

    'search[store_id][operator]': '=',
    'search[store_id][value]': store_id,

    'search[created_at][operator]': '>=',
    'search[created_at][value]': formatDateTime(new Date(), 'YYYY-MM-DD'),
  };
  return request(url, {
    method: 'GET',
    params: params,
  });
}
