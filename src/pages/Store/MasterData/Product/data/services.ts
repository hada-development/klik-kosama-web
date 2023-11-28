import { PaginationList } from '@/common/data/data';
import { requestTableData } from '@/common/utils/utils';
import { request } from 'umi';
import { ProductTableItem } from './data';

const baseUrl = '/api/web/store/product';

export async function getProductDataTable(
  storeID: number,
  params: any,
  options?: { [key: string]: any },
): Promise<PaginationList<ProductTableItem>> {
  return requestTableData<ProductTableItem>(baseUrl, params, options, {
    store_id: storeID,
  });
}

export async function storeProduct(store_id: number, data: { [key: string]: any }) {
  data.stocks[0].store_id = store_id;
  data.prices[0].store_id = store_id;
  return request(baseUrl, {
    method: 'POST',
    data: data,
  });
}

export async function updateProduct(
  store_id: number,
  productId: number,
  data: { [key: string]: any },
) {
  data.stocks[0].store_id = store_id;
  data.prices[0].store_id = store_id;
  return request(`${baseUrl}/${productId}`, {
    method: 'PUT',
    data: data,
  });
}

export async function getProductDetail(storeId: number, productId: number) {
  const store_id = storeId;
  return request(`${baseUrl}/${productId}`, {
    params: {
      store_id: store_id,
    },
    method: 'GET',
  });
}
