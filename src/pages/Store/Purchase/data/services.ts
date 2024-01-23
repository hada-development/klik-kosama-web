import { PaginationList } from '@/common/data/data';
import { requestTableData } from '@/common/utils/utils';
import { isObject } from 'lodash';
import { request } from 'umi';
import { PurchaseDetail, PurchaseTableItem } from './data';

const baseUrl = '/api/web/store/purchase';

export async function getPurchaseDataTable(
  storeID: number,
  params: any,
  options?: { [key: string]: any },
): Promise<PaginationList<PurchaseTableItem>> {
  return requestTableData<PurchaseTableItem>(baseUrl, params, options, {
    store_id: storeID,
    'order[date]': 'desc',
  });
}

export async function storePurchase(storeID: number, data: any) {
  const formData = convertDataToFormData(data);
  formData.append('store_id', storeID.toString());

  return request(baseUrl, {
    method: 'POST',
    data: formData,
  });
}

export async function deletePurchase(purchaseID: number) {
  return request(`${baseUrl}/${purchaseID}`, {
    method: 'DELETE',
  });
}

function convertDataToFormData(data: any) {
  const formData = new FormData();
  // Iterate over the keys of the data object
  for (const key in data) {
    if (key == 'file') {
      if (data[key][0].originFileObj != undefined) {
        formData.append(key, data[key][0].originFileObj);
      }
    } else if (data.hasOwnProperty(key)) {
      // Check if the current value is an array
      if (Array.isArray(data[key])) {
        // If it's an array, iterate over its elements and append each to FormData
        data[key].forEach((item: any, index: any) => {
          for (const itemKey in item) {
            if (item.hasOwnProperty(itemKey)) {
              // If the item is a file, append it to FormData with a specific name
              if (itemKey === 'file') {
                formData.append(`${key}[${index}][${itemKey}]`, item[itemKey], item[itemKey].name);
              } else {
                formData.append(`${key}[${index}][${itemKey}]`, item[itemKey]);
              }
            }
          }
        });
      } else {
        // If it's not an array, append it to FormData
        formData.append(key, data[key]);
      }
    }
  }
  return formData;
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
  const formData = convertDataToFormData(reformatSelectData(data));
  formData.append('_method', 'PUT');
  return request(`${baseUrl}/${id}`, {
    method: 'POST',
    data: formData,
  });
}

export async function getProduct(storeID: number, query: string) {
  const url = '/api/web/pos/products';
  return request(url, {
    method: 'GET',
    params: {
      store_id: storeID,
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
  file: data.file
    ? [
        {
          uuid: '1',
          name: data.file?.name,
          status: 'done',
          url: data.file?.address,
        },
      ]
    : null,
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
