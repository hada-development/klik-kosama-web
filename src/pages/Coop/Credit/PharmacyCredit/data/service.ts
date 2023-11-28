import { PaginationList, ResponseData } from '@/common/data/data';
import { formatTableParams, requestTableData } from '@/common/utils/utils';
import { request } from 'umi';
import { PharmacyCreditDetail, PharmacyCreditListItem } from './data';

const baseUrl = '/api/web/coop/credit';

export async function getPharmacyCreditListTable(
  params: any,
  options?: { [key: string]: any },
): Promise<PaginationList<PharmacyCreditListItem>> {
  try {
    const formattedParams = formatTableParams(params);

    let response = await request(baseUrl, {
      method: 'GET',
      params: {
        ...formattedParams,
        type: 'store',
      },
      ...(options || {}),
    });
    console.log(response.data);
    return {
      current_page: response.current_page,
      data: response.data,
      total: response.total,
    };
  } catch (e) {
    throw e;
  }
}

export interface LoanRepoerProp {
  store_id: number;
  month_range: [string, string];
}

export async function getStoreLoanDataTable(
  params: any,
  reportParams: LoanRepoerProp,
  options?: { [key: string]: any },
): Promise<PaginationList<PharmacyCreditListItem>> {
  return requestTableData<PharmacyCreditListItem>('/api/web/coop/store-loan', params, options, {
    ...reportParams,
  });
}

export async function getPharmacyCreditDetail(
  id: number,
): Promise<ResponseData<PharmacyCreditDetail>> {
  const response = await request(`${baseUrl}/${id}`, {
    method: 'GET',
  });
  return response;
}
