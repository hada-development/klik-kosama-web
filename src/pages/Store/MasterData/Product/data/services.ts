import { PaginationList } from '@/common/data/data';
import { requestTableData } from '@/common/utils/utils';
import { isBoolean } from 'lodash';
import { request } from 'umi';
import { ProductTableItem } from './data';

const baseUrl = '/api/web/store/product';

function isObject(o: any) {
  return o !== null && typeof o === 'object' && Array.isArray(o) === false;
}

function boolToString(o: any): string {
  if (isBoolean(o)) {
    return o ? '1' : '0';
  }
  return o;
}

function convertDataToFormData(data: any) {
  const formData = new FormData();
  // Iterate over the keys of the data object
  for (const key in data) {
    if (key === 'image') {
      if (data[key]?.file?.originFileObj !== undefined) {
        formData.append(key, data[key].file.originFileObj);
      }
    } else if (data.hasOwnProperty(key)) {
      // Check if the current value is an array
      if (Array.isArray(data[key])) {
        data[key].forEach((item: any, index: any) => {
          if (isObject(item)) {
            for (const itemKey in item) {
              if (item.hasOwnProperty(itemKey)) {
                formData.append(`${key}[${index}][${itemKey}]`, item[itemKey]);
              }
            }
          } else {
            formData.append(`${key}[${index}]`, item);
          }
        });
      } else if (isObject(data[key])) {
        Object.keys(data[key]).forEach((objKey) => {
          formData.append(`${key}[${objKey}]`, boolToString(data[key][objKey]));
        });
      } else {
        // If it's not an array, append it to FormData
        formData.append(key, data[key]);
      }
    }
  }
  return formData;
}

export async function getProductDataTable(
  storeID: number,
  params: any,
  options?: { [key: string]: any },
): Promise<PaginationList<ProductTableItem>> {
  return requestTableData<ProductTableItem>(baseUrl, params, options, {
    store_id: storeID,
  });
}

export async function getProductUOM(): Promise<any[]> {
  const response = await request(`${baseUrl}/uom`, {
    method: 'GET',
  });
  return response.data;
}

export async function storeProduct(store_id: number, data: { [key: string]: any }) {
  data.stocks[0].store_id = store_id;
  data.prices[0].store_id = store_id;

  let formData = convertDataToFormData(data);

  return request(baseUrl, {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function updateProduct(
  store_id: number,
  productId: number,
  data: { [key: string]: any },
) {
  data.stocks[0].store_id = store_id;
  data.prices[0].store_id = store_id;

  let formData = convertDataToFormData(data);
  formData.append('_method', 'PUT');
  return request(`${baseUrl}/${productId}`, {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function deleteProduct(productId: number) {
  return request(`${baseUrl}/${productId}`, {
    method: 'DELETE',
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
