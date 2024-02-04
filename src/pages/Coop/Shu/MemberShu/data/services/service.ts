import { PaginationList } from '@/common/data/data';
import { requestTableData } from '@/common/utils/utils';
import { MemberShu } from '@/pages/Coop/Shu/MemberShu/data/data';
import { request } from 'umi';

export async function getMemberShu(
  params: any,
  options?: { [key: string]: any },
): Promise<PaginationList<MemberShu>> {
  return requestTableData<MemberShu>('/api/web/coop/shu', params, options);
}

export async function addMemberShu(data?: { [key: string]: any }) {
  return request('/api/web/coop/shu', {
    method: 'POST',
    data: data,
  });
}

export async function editMemberShu(id?: number, data?: { [key: string]: any }) {
  return request(`/api/web/coop/shu/${id}`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteMemberShu(id?: number) {
  return request(`/api/web/coop/shu/${id}`, {
    method: 'DELETE',
  });
}

export async function importMemberShu(value: any) {
  const formData = new FormData();
  console.log(value.file);
  formData.append('file', value.file);
  let response = await request(`/api/web/coop/shu/import`, {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
}
