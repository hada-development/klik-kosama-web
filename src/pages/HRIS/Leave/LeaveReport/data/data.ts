export interface LeaveReportItem {
  id: number;
  start_date: string;
  end_date: string;
  note: string;
  employee_nip: string;
  employee_name: string;
  position: string;
  leave_type: string;
  total_days: number;
}
