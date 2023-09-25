import { request } from 'umi';

export async function getFilteredAttendanceData(params: any) {
  console.log(params);
  return request('/api/web/hr/attendance', {
    params: {
      ...params,
      page: params.current,
    },
  });
}
