import { formatTableParams } from '@/common/utils/utils';
import { request } from 'umi';

export async function getEmployee(params: any, options?: { [key: string]: any }) {
  try {
    const formattedParams = formatTableParams(params);
    console.log(formattedParams);
    let response = await request('/api/web/hr/employee', {
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
    console.log(e);
    throw e;
  }
}

export async function addEmployee(data?: { [key: string]: any }) {
  return request('/api/web/hr/employee', {
    method: 'POST',
    data: data,
  });
}

export async function editEmployee(id?: number | string, data?: { [key: string]: any }) {
  return request(`/api/web/hr/employee/${id}`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteEmployee(id?: number | string) {
  return request(`/api/web/hr/employee/${id}`, {
    method: 'DELETE',
  });
}

export async function getEmployeeAccount(id?: number | string) {
  return request(`/api/web/hr/employee/${id}`, {
    method: 'GET',
  });
}

/** ======= Profile Photo ======== */
export async function getProfilePhoto(userId: number | string) {
  return request(`/api/web/profile-photo/${userId}`, {
    method: 'GET',
  });
}

export async function uploadPhoto(value: any) {
  return request(`/api/web/profile-photo`, {
    method: 'POST',
    data: generateProfileFormData(value),
  });
}

/** ========= User Data ========= */
export async function editUserData(userId: number | string, data?: { [key: string]: any }) {
  return request(`/api/web/user/${userId}`, {
    method: 'PUT',
    data: { ...data, user_id: userId },
  });
}

/** ========= Personal Data ========= */
export async function editPersonalData(userId?: number | string, data?: { [key: string]: any }) {
  return request(`/api/web/personal-data`, {
    method: 'POST',
    data: { ...data, user_id: userId },
  });
}

/** ========= Bank Account ========= */
export async function editBankAccount(userId?: number | string, data?: { [key: string]: any }) {
  return request(`/api/web/bank-account`, {
    method: 'POST',
    data: { ...data, user_id: userId },
  });
}

function generateProfileFormData(values: any): FormData {
  const formData = new FormData();
  formData.append('image', values.file);
  formData.append('user_id', values.data.user_id);
  return formData;
}

/** ======= Bank List ======== */
export async function getBankList(
  query: string,
): Promise<{ message?: string | undefined; data?: { id: number; name: string }[] }> {
  return request(`/api/web/bank?search[name]=${query}`, {
    method: 'GET',
  });
}
