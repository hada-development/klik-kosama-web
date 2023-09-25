export type VoluntaryWithdrawSubmissionItem = {
  id: number;
  number: string;
  member_no: string;
  member_name: string;
  amount: number;
  status: string;
  date: string;
};

export type VoluntaryWithdrawSubmissionList = {
  current_page?: number;
  total?: number;
  data: VoluntaryWithdrawSubmissionItem[];
};

export interface VoluntaryWithdrawSubmissionDetail {
  id: number;
  submission_id: number;
  amount: number;
  status: string;
  status_text: string;
  member_id: number;
  note: string;
  created_at: string;
  updated_at: string;
  savings: Savings;
  parent_submission: ParentSubmission;
  member: Member;
}

export interface Savings {
  member_id: number;
  member_name: string;
  member_no: string;
  member_type: string;
  member_status: string;
  total_saving: number;
  principal_saving: number;
  mandatory_saving: number;
  voluntary_saving: number;
  voluntary_withdrawal: number;
}

export interface ParentSubmission {
  id: number;
  number: string;
  user_id: number;
  type: string;
  status: string;
  note: string;
  current_step_id: number;
  created_at: string;
  updated_at: string;
  is_approvable: boolean;
  current_step?: CurrentStep;
}

export interface CurrentStep {
  id: number;
  type: string;
  order: number;
  user_id: number;
  name: string;
  rule: any;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: number;
  name: string;
  member_no: string;
  type: string;
  status: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}
