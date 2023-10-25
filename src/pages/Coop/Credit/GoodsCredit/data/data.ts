import { User } from '@/common/data/data';
import { CreditSubmissionSubmissionDetail } from '@/pages/Coop/Submission/CreditSubmission/data/data';
import { ProSchemaValueEnumType } from '@ant-design/pro-components';
import { PaymentHistory } from '../../data/data';

export const CreditStatuses: { [key: string]: ProSchemaValueEnumType } = {
  active: {
    text: 'Aktif',
    status: 'Processing',
  },
  paid: {
    text: 'Lunas',
    status: 'Success',
  },
};

export type CreditType = 'goods' | 'store';

export type GoodsCreditListItem = {
  id: number;
  credit_no: string;
  user_id: number;
  type: CreditType;
  note: string;
  status: string;
  installment_term: number;
  buy_price: number;
  sell_price: number;
  total_paid: number;
  is_paid: number;
  handover_date: string;
  due_date: string;
  creditable_type?: string;
  creditable_id?: number;
  created_at: string;
  updated_at: string;
  user: User;
};

export type GoodsCreditDetail = GoodsCreditListItem & {
  creditable: Partial<CreditSubmissionSubmissionDetail>;
  payment_histories: PaymentHistory[];
};
