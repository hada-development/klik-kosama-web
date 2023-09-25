import { request } from 'umi';

export async function getEducationLevel(params: any, options?: { [key: string]: any }) {
  try {
    var params = { ...params };
    if (params.name) {
      params = {
        ...params,
        'search[name]': params.name,
      };
    }
    let response = await request('/api/web/hr/education-level', {
      method: 'GET',
      params: {
        ...params,
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

export async function addEducationLevel(data?: { [key: string]: any }) {
  return request('/api/web/hr/education-level', {
    method: 'POST',
    data: data,
  });
}

export async function editEducationLevel(id?: number, data?: { [key: string]: any }) {
  return request(`/api/web/hr/education-level/${id}`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteEducationLevel(id?: number) {
  return request(`/api/web/hr/education-level/${id}`, {
    method: 'DELETE',
  });
}
