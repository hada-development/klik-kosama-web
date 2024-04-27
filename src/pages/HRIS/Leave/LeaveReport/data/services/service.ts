import { requestTableData } from '@/common/utils/utils';
import { LeaveReportItem } from '@/pages/HRIS/Leave/LeaveReport/data/data';

const baseUrl = '/api/web/hr/leave/report';

export async function getLeaveReport(params: any, options?: { [key: string]: any }, month?: any) {
  return requestTableData<LeaveReportItem>(baseUrl, params, options, {
    month: month,
  });
}
