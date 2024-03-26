import { PaginationList } from '@/common/data/data';
import { requestTableData } from '@/common/utils/utils';
import { ReportModel } from '@/pages/Coop/Report/data/data';
import { request } from '@@/exports';

const baseUrl = '/api/web/coop/report';

function convertDataToFormData(data: any) {
  const formData = new FormData();
  // Iterate over the keys of the data object
  for (const key in data) {
    if (key === 'file') {
      if (data[key][0].originFileObj !== undefined) {
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

export async function getReportDataTable(
  params: any,
  options?: { [key: string]: any },
): Promise<PaginationList<ReportModel>> {
  return requestTableData<ReportModel>(baseUrl, params, options);
}

export async function storeReport(data: any) {
  const formData = convertDataToFormData(data);
  return request(baseUrl, {
    method: 'POST',
    data: formData,
  });
}

export async function updateReport(id: string, data: any) {
  const formData = convertDataToFormData(data);
  formData.append('_method', 'PUT');
  return request(`${baseUrl}/${id}`, {
    method: 'POST',
    data: formData,
  });
}

export async function deleteReport(reportId: number) {
  return request(`${baseUrl}/${reportId}`, {
    method: 'DELETE',
  });
}
