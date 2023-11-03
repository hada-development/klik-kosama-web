import { PaginationList, ResponseData } from '@/common/data/data';
import { requestTableData } from '@/common/utils/utils';
import { request } from 'umi';
import {
  MemberReport,
  MemberSale,
  PaymentMethodReport,
  ProductSale,
  SellingReport,
  TransactionReport,
} from './data';

export interface ReportRequestProp {
  store_id: number;
  date_range: [string, string];
}

export async function getSellingSummary(
  params: ReportRequestProp,
): Promise<ResponseData<SellingReport>> {
  return request('/api/web/store/report/selling', {
    method: 'GET',
    params: params,
  });
}

export async function getTransactionSummary(
  params: ReportRequestProp,
): Promise<ResponseData<TransactionReport>> {
  return request('/api/web/store/report/transaction', {
    method: 'GET',
    params: params,
  });
}

export async function getPaymentMethodReport(
  params: ReportRequestProp,
): Promise<ResponseData<PaymentMethodReport[]>> {
  return request('/api/web/store/report/payment-method', {
    method: 'GET',
    params: params,
  });
}

export async function getMemberReport(
  params: ReportRequestProp,
): Promise<ResponseData<MemberReport>> {
  return request('/api/web/store/report/member', {
    method: 'GET',
    params: params,
  });
}

export async function getMemberReportDataTable(
  params: any,
  reportParams: ReportRequestProp,
  options?: { [key: string]: any },
): Promise<PaginationList<MemberSale>> {
  return requestTableData<MemberSale>('/api/web/store/report/member-datatable', params, options, {
    ...reportParams,
  });
}

export async function getProductReportDataTable(
  params: any,
  reportParams: ReportRequestProp,
  options?: { [key: string]: any },
): Promise<PaginationList<ProductSale>> {
  return requestTableData<ProductSale>('/api/web/store/report/product', params, options, {
    ...reportParams,
  });
}
