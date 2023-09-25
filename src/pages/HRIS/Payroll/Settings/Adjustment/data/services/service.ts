import { formatTableParams } from '@/common/utils/utils';
import { request } from 'umi';

export async function getAdjustment(params: any, options?: { [key: string]: any }) {
  try {
    const formattedParams = formatTableParams(params);
    let response = await request('/api/web/hr/payroll/adjustment', {
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

export async function addAdjustment(data?: { [key: string]: any }) {
  return request('/api/web/hr/payroll/component', {
    method: 'POST',
    data: data,
  });
}

export async function editAdjustment(id?: number, data?: { [key: string]: any }) {
  return request(`/api/web/hr/payroll/component/${id}`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteAdjustment(id?: number) {
  return request(`/api/web/hr/payroll/adjustment/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchPayrollComponent(id?: number) {
  return request(`/api/web/hr/payroll/component/${id}`, {
    method: 'GET',
  });
}
