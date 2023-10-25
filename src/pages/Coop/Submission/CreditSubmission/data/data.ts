import { File, Savings, User } from '@/common/data/data';
import { ParentSubmission, UserCredit } from '../../data/data';

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

export interface Calculation {
  total_margin: number;
  total_installment: number;
  monthly_margin: number;
  monthly_installment: number;
}

export interface Type {
  id: number;
  name: string;
  status: string;
  margin: number;
  created_at: string;
  updated_at: string;
}

export interface InstallmentTerm {
  term: number;
  title: string;
}
