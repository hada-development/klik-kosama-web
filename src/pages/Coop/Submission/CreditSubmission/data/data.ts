import { File } from '@/common/data/data';
import { UserCredit } from '../../data/data';

export type CreditSubmissionSubmissionItem = {
  id: number;
  number: string;
  name: string;
  note: string;
  installment_term: number;
  buy_price: number;
  sell_price: number;
  margin: number;
  status: string;
  date: string;
};

export type CreditSubmissionSubmissionList = {
  current_page?: number;
  total?: number;
  data: CreditSubmissionSubmissionItem[];
};

export interface CreditSubmissionSubmissionDetail {
  id: number;
  submission_id: number;
  user_id: number;
  goods_credit_type_id: number;
  note: string;
  installment_term: number;
  buy_price: number;
  sell_price: number;
  file_id: any;
  status: string;
  created_at: string;
  updated_at: string;
  savings: Savings;
  monthly_installment: number;
  calculation: Calculation;
  status_text: string;
  parent_submission: ParentSubmission;
  user: User;
  type: Type;
  file?: File;
  user_unpaid_load: number;
  user_credits: UserCredit[];
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

export interface Calculation {
  total_margin: number;
  total_installment: number;
  monthly_margin: number;
  monthly_installment: number;
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

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: any;
  profile_photo_file_id: any;
  verification_status: string;
  created_at: string;
  updated_at: string;
  member: Member;
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

export interface Type {
  id: number;
  name: string;
  status: string;
  margin: number;
  created_at: string;
  updated_at: string;
}
