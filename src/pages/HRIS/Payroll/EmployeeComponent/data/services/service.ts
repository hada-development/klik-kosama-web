import { formatTableParams } from '@/common/utils/utils';
import { request } from 'umi';

export async function getEmployeeComponent(params: any, options?: { [key: string]: any }) {
  try {
    const formattedParams = formatTableParams(params);
    console.log(formattedParams);
    let response = await request('/api/web/hr/payroll/employee-component', {
      method: 'GET',
      params: {
        ...formattedParams,
        'order[u.name]': 'ASC',
      },
      ...(options || {}),
    });
    return {
      current_page: response.current_page,
      data: response.data,
      total: response.total,
    };
  } catch (e: any) {
    console.log(e.response);
    throw e;
  }
}

export async function getComponentItems(
  employeeId: number,
): Promise<EmployeeComponentFeature.PayrollComponentItem[]> {
  const data = await request(`/api/web/hr/payroll/employee-component/${employeeId}`, {
    method: 'GET',
  });
  return data.data;
}

export async function getPayrollFormula(
  componentId: number,
): Promise<EmployeeComponentFeature.PayrollFormula[]> {
  const data = await request(`/api/web/hr/payroll/employee-component/components/${componentId}`, {
    method: 'GET',
  });
  return data.data;
}

export async function storeEmployeeComponent(
  data: EmployeeComponentFeature.EmployeePayrollComponentDTO,
) {
  return request('/api/web/hr/payroll/employee-component', {
    method: 'POST',
    data: data,
  });
}

export async function editEmployeeComponent(id?: number, data?: { [key: string]: any }) {
  return request(`/api/web/hr/employeecomponent/${id}`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteEmployeeComponent(id?: number) {
  return request(`/api/web/hr/employeecomponent/${id}`, {
    method: 'DELETE',
  });
}

export async function resetEmployeeComponent() {
  return request(`/api/web/hr/payroll/employee-component`, {
    method: 'DELETE',
  });
}

export async function getPayrollTemplate(): Promise<
  EmployeeComponentFeature.ResponseData<EmployeeComponentFeature.PayrollTemplate>
> {
  return request(`/api/web/hr/payroll/template`, {
    method: 'GET',
  });
}

export async function postPayrollTemplate(data: any): Promise<void> {
  return request(`/api/web/hr/payroll/employee-component/generate`, {
    method: 'POST',
    data: data,
  });
}
