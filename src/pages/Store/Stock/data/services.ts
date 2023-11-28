import { PaginationList } from '@/common/data/data';
import { requestTableData } from '@/common/utils/utils';
import { request } from 'umi';
import { StockHistoryItem, StockTableItem } from './data';

const baseUrl = '/api/web/store/stock';

export async function getStockDataTable(
  storeId: number,
  params: any,
  options?: { [key: string]: any },
): Promise<PaginationList<StockTableItem>> {
  return requestTableData<StockTableItem>(baseUrl, params, options, {
    store_id: storeId,
  });
}

export async function getStockHistoryDataTable(
  stockId: number,
  params: any,
  options?: { [key: string]: any },
): Promise<PaginationList<StockHistoryItem>> {
  return requestTableData<StockHistoryItem>(`${baseUrl}/${stockId}`, params, options, {
    'order[created_at]': 'desc',
  });
}

export async function storeStock(storeId: number, data: { [key: string]: any }) {
  data.stocks[0].store_id = storeId;
  data.prices[0].store_id = storeId;
  return request(baseUrl, {
    method: 'POST',
    data: data,
  });
}

export async function updateStock(StockId: number, data: { [key: string]: any }) {
  return request(`${baseUrl}/${StockId}`, {
    method: 'PUT',
    data: data,
  });
}

export async function getStockDetail(storeId: number, StockId: number) {
  const store_id = storeId;
  return request(`${baseUrl}/${StockId}`, {
    params: {
      store_id: store_id,
    },
    method: 'GET',
  });
}
