import { PaginationList } from '@/common/data/data';
import { requestTableData } from '@/common/utils/utils';
import { request } from 'umi';

export async function getSupplier(
  params: any,
  options?: { [key: string]: any },
): Promise<PaginationList<SupplierFeature.SupplierListItem>> {
  return requestTableData<SupplierFeature.SupplierListItem>(
    '/api/web/store/supplier',
    params,
    options,
  );
}

export async function addSupplier(data?: { [key: string]: any }) {
  return request('/api/web/store/supplier', {
    method: 'POST',
    data: data,
  });
}

export async function editSupplier(id?: number, data?: { [key: string]: any }) {
  return request(`/api/web/store/supplier/${id}`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteSupplier(id?: number) {
  return request(`/api/web/store/supplier/${id}`, {
    method: 'DELETE',
  });
}
