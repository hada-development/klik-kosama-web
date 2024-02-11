import { formatTableParams } from '@/common/utils/utils';
import { request } from '@@/exports';

export async function getSavingTransaction(
  params: any,
  options?: { [key: string]: any },
): Promise<{
  current_page: number;
  data: SavingTransactionFeature.SavingTransactionListItem[];
  total: number;
}> {
  const formattedParams = formatTableParams(params);
  let response = await request('/api/web/store/voucher-group', {
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
}
