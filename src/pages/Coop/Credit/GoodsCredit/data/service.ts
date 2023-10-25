import { PaginationList, ResponseData } from '@/common/data/data';
import { formatTableParams } from '@/common/utils/utils';
import { request } from 'umi';
import { GoodsCreditDetail, GoodsCreditListItem } from './data';

const baseUrl = '/api/web/coop/credit';

export async function getGoodsCreditListTable(
  params: any,
  options?: { [key: string]: any },
): Promise<PaginationList<GoodsCreditListItem>> {
  try {
    const formattedParams = formatTableParams(params);

    let response = await request(baseUrl, {
      method: 'GET',
      params: {
        ...formattedParams,
        type: 'goods',
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

export async function getGoodsCreditDetail(id: number): Promise<ResponseData<GoodsCreditDetail>> {
  const response = await request(`${baseUrl}/${id}`, {
    method: 'GET',
  });
  return response;
}
