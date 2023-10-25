import { PaginationList } from '@/common/data/data';
import { requestTableData } from '@/common/utils/utils';
import { request } from 'umi';
import { ProductTableItem } from './data';

const baseUrl = '/api/web/store/product';

export async function getProductDataTable(
  params: any,
  options?: { [key: string]: any },
): Promise<PaginationList<ProductTableItem>> {
  return requestTableData<ProductTableItem>(baseUrl, params, options, {
    store_id: 1,
  });
}

export async function storeProduct(data: { [key: string]: any }) {
  // TODO: CHANGE STORE ID TO SELECTED
  data.stocks[0].store_id = 1;
  data.prices[0].store_id = 1;
  return request(baseUrl, {
    method: 'POST',
    data: data,
  });
}

export async function updateProduct(productId: number, data: { [key: string]: any }) {
  // TODO: CHANGE STORE ID TO SELECTED
  data.stocks[0].store_id = 1;
  data.prices[0].store_id = 1;
  return request(`${baseUrl}/${productId}`, {
    method: 'PUT',
    data: data,
  });
}

export async function getProductDetail(productId: number) {
  // TODO: CHANGE STORE ID TO SELECTED
  const store_id = 1;
  return request(`${baseUrl}/${productId}`, {
    params: {
      store_id: store_id,
    },
    method: 'GET',
  });
}
