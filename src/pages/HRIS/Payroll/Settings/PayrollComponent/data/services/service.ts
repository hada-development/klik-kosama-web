import { formatTableParams } from '@/common/utils/utils';
import { request } from 'umi';

export async function getPayrollComponent(params: any, options?: { [key: string]: any }) {
  try {
    const formattedParams = formatTableParams(params);
    let response = await request('/api/web/hr/payroll/component', {
      method: 'GET',
      params: {
        ...formattedParams,
      },
      ...(options || {}),
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

export async function addPayrollComponent(data?: { [key: string]: any }) {
  return request('/api/web/hr/payroll/component', {
    method: 'POST',
    data: data,
  });
}

export async function editPayrollComponent(id?: number, data?: { [key: string]: any }) {
  return request(`/api/web/hr/payroll/component/${id}`, {
    method: 'PUT',
    data: data,
  });
}

export async function deletePayrollComponent(id?: number) {
  return request(`/api/web/hr/payroll/component/${id}`, {
    method: 'DELETE',
  });
}
