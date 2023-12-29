import { PaginationList } from '@/common/data/data';
import { requestTableData } from '@/common/utils/utils';
import { request } from 'umi';

export async function getLeaveType(
  params: any,
  options?: { [key: string]: any },
): Promise<PaginationList<LeaveTypeFeature.LeaveTypeListItem>> {
  return requestTableData<LeaveTypeFeature.LeaveTypeListItem>(
    '/api/web/hr/leave-type',
    params,
    options,
  );
}

export async function addLeaveType(data?: { [key: string]: any }) {
  return request('/api/web/hr/leave-type', {
    method: 'POST',
    data: data,
  });
}

export async function editLeaveType(id?: number, data?: { [key: string]: any }) {
  return request(`/api/web/hr/leave-type/${id}`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteLeaveType(id?: number) {
  return request(`/api/web/hr/leave-type/${id}`, {
    method: 'DELETE',
  });
}
