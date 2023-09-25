import { File } from '@/common/data/data';

export interface Submission {
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
  histories: History[];
  current_step: Step;
}

export interface History {
  id: number;
  submission_id: number;
  user_id: number;
  status: string;
  note: string;
  submission_step_id: number;
  file_id: any;
  file?: File;
  created_at: string;
  updated_at: string;
  step: Step;
  user: User;
}

export interface Step {
  id: number;
  type: string;
  order: number;
  user_id: number;
  name: string;
  rule?: Rule;
  created_at: string;
  updated_at: string;
}

export interface Rule {
  finished: boolean;
  additional_fields?: AdditionalField[];
}

export interface AdditionalField {
  id: string;
  name: string;
  type: 'image' | 'date';
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
}

export interface UserCredit {
  id: number;
  credit_no: string;
  user_id: number;
  type: string;
  note: string;
  installment_term: number;
  buy_price: number;
  sell_price: number;
  total_paid: number;
  is_paid: number;
  handover_date: string;
  due_date: string;
  creditable_type: string;
  creditable_id: number;
  created_at: string;
  updated_at: string;
}
