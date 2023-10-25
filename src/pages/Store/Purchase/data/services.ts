import { PaginationList } from '@/common/data/data';
import { requestTableData } from '@/common/utils/utils';
import { PurchaseTableItem } from './data';

const baseUrl = '/api/web/store/purchase';

export async function getPurchaseDataTable(
  params: any,
  options?: { [key: string]: any },
): Promise<PaginationList<PurchaseTableItem>> {
  return requestTableData<PurchaseTableItem>(baseUrl, params, options, {
    store_id: 1,
  });
}
