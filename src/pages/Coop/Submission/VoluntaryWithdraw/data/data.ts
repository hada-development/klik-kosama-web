import { Member, Savings } from '@/common/data/data';
import { ParentSubmission } from '../../data/data';

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
