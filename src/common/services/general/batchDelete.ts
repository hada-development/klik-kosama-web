import { request } from 'umi';

// Batch Delete
export async function doBatchDelete(endpoint: string, ids: number[]) {
  return request(`/api/web/${endpoint}`, {
    method: 'DELETE',
    data: {
      ids: ids,
    },
  });
}
