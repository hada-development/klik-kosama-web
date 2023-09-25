import { request } from 'umi';

export const getFilteredAndPaginatedData = async (
  employeeId: number | string,
  year: string | number,
  month: string | number,
) => {
  return request('/api/web//hr/attendance/monthly-report', {
    method: 'GET',
    params: {
      employee_id: employeeId,
      month: month,
      year: year,
    },
  });
};
