import { PaginationList } from '@/common/data/data';
import { requestTableData } from '@/common/utils/utils';
import { isObject } from 'lodash';
import { request } from 'umi';
import { PurchaseDetail, PurchaseTableItem } from './data';

const baseUrl = '/api/web/store/purchase';

export async function getPurchaseDataTable(
  params: any,
  options?: { [key: string]: any },
): Promise<PaginationList<PurchaseTableItem>> {
  return requestTableData<PurchaseTableItem>(baseUrl, params, options, {
    store_id: 1,
    'order[date]': 'desc',
  });
}

export async function storePurchase(data: any) {
  // TODO: Change store_id
  const store_id = 1;
  return request(baseUrl, {
    method: 'POST',
    data: {
      store_id: 1,
      ...data,
    },
  });
}

// reformat select data
const reformatSelectData = (data: any): PurchaseDetail => ({
  ...data,
  supplier_id: isObject(data.supplier_id) ? data.supplier_id.value : 1,
  items: data.items.map((item: any, index: number) => ({
    ...item,
    product_id: isObject(item.product_id) ? item.product_id.value : item.product_id,
    id: index, // Set 'id' to the new index
  })),
});

export async function updatePurchase(id: string, data: any) {
  return request(`${baseUrl}/${id}`, {
    method: 'PUT',
    data: reformatSelectData(data),
  });
}

export async function getProduct(query: string) {
  // TODO: Change store_id
  const store_id = 1;
  const url = '/api/web/pos/products';
  return request(url, {
    method: 'GET',
    params: {
      store_id: store_id,
      query: query,
    },
  });
}

// Reset the 'id' attribute in 'items' to start from 0
const resetData = (data: PurchaseDetail): any => ({
  ...data,
  items: data.items.map((item, index) => ({
    ...item,
    product_id: {
      value: item.product?.id,
      label: `${item.product?.sku} - ${item.product?.name}`,
    },
    id: index, // Set 'id' to the new index
  })),
});

export async function getPurchase(id: number): Promise<PurchaseDetail> {
  const url = `${baseUrl}/${id}`;
  const response = await request(url, {
    method: 'GET',
  });
  if (response.success) {
    var data = response.data;
    return resetData(data);
  }
  throw new Error('This is an error message.');
}

export async function publishPurchase(id: number) {
  const url = `${baseUrl}/${id}`;
  const response = await request(url, {
    method: 'PUT',
    params: {
      status: 'published',
    },
  });
  return response;
}
