import { request } from 'umi';

export async function getUser(
  params: any,
  options?: { [key: string]: any },
): Promise<{ current_page: number; data: UserFeature.UserListItem[]; total: number }> {
  try {
    var params = { ...params };
    if (params.name) {
      params = {
        ...params,
        'search[name]': params.name,
      };
    }
    let response = await request('/api/web/user', {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });

    var data = response.data.map((e: any) => {
      return {
        ...e,
        roles: e.roles.map((r: any) => r.name),
        permissions: e.permissions.map((r: any) => r.name),
        store_ids: e.stores.map((r: any) => r.id),
      };
    });

    return {
      current_page: response.current_page,
      data: data,
      total: response.total,
    };
  } catch (e) {
    throw e;
  }
}

export async function addUser(data?: { [key: string]: any }) {
  return request('/api/web/user', {
    method: 'POST',
    data: data,
  });
}

export async function editUser(id?: number, data?: { [key: string]: any }) {
  return request(`/api/web/user/${id}`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteUser(id?: number) {
  return request(`/api/web/user/${id}`, {
    method: 'DELETE',
  });
}
