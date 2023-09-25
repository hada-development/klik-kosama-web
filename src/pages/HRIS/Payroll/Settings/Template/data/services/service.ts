import { formatTableParams } from '@/common/utils/utils';
import { request } from 'umi';

export async function getPayrollTemplate(
  params: any,
  options?: { [key: string]: any },
): Promise<PayrollTemplateFeature.PayrollTemplateList> {
  try {
    const formattedParams = formatTableParams(params);
    let response = await request('/api/web/hr/payroll/template', {
      method: 'GET',
      params: {
        ...formattedParams,
      },
      ...(options || {}),
    });
    return {
      current_page: response.current_page,
      total: response.total,
      data: response.data,
    };
  } catch (e) {
    throw e;
  }
}

export async function getPayrollFormula(
  componentId: number,
): Promise<EmployeeComponentFeature.PayrollFormula[]> {
  const data = await request(`/api/web/hr/payroll/employee-component/components/${componentId}`, {
    method: 'GET',
  });
  return data.data;
}

export async function deletePayrollTemplate(templateId: number): Promise<void> {
  const data = await request(`/api/web/hr/payroll/template/${templateId}`, {
    method: 'DELETE',
  });
  return data.data;
}

export async function addPayrollTemplate(data: any): Promise<void> {
  await request(`/api/web/hr/payroll/template`, {
    method: 'POST',
    data: data,
  });
  return;
}

export async function editPayrollTemplate(id: number, data: any): Promise<void> {
  await request(`/api/web/hr/payroll/template/${id}`, {
    method: 'PUT',
    data: data,
  });
  return;
}
