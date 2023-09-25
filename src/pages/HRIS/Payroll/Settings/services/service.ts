import { request } from 'umi';

export async function getAdjustmentDetail(adjustmentId: number | string) {
  try {
    let response = await request(`/api/web/hr/payroll/adjustment/${adjustmentId}`, {
      method: 'GET',
    });
    return {
      current_page: response.current_page,
      data: response.data,
      total: response.total,
    };
  } catch (e) {
    throw e;
  }
}

export async function importExcel(value: any) {
  try {
    const formData = new FormData();
    console.log(value.file);
    formData.append('excel_file', value.file);
    let response = await request(`/api/web/hr/payroll/adjustment/import`, {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (e) {
    throw e;
  }
}

export async function storeAdjustment(data: any) {
  try {
    let response = await request(`/api/web/hr/payroll/adjustment`, {
      method: 'POST',
      data: data,
    });
    return response;
  } catch (e) {
    throw e;
  }
}
