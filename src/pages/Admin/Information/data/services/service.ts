import { PaginationList } from '@/common/data/data';
import { requestTableData } from '@/common/utils/utils';
import { request } from 'umi';
import { InformationTableItem } from '../data';

const baseUrl = '/api/web/information';

function generateFormData(values: any): FormData {
  const formData = new FormData();
  formData.append('title', values.title);
  formData.append('content', values.content);
  formData.append('status', values.status);
  if (values.image?.file) {
    formData.append('image', values.image.file.originFileObj);
  }
  return formData;
}
export async function getInformationDataTable(
  params: any,
  options?: { [key: string]: any },
): Promise<PaginationList<InformationTableItem>> {
  return requestTableData<InformationTableItem>(baseUrl, params, options);
}

export async function addInformation(data?: { [key: string]: any }) {
  const formData = generateFormData(data);
  return request(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  });
}

export async function editInformation(id?: number, data?: { [key: string]: any }) {
  const formData = generateFormData(data);
  formData.append('_method', 'PUT');
  return request(`${baseUrl}/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  });
}

export async function deleteInformation(id?: number) {
  return request(`${baseUrl}/${id}`, {
    method: 'DELETE',
  });
}
