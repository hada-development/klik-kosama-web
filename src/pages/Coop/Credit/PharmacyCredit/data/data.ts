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

export type CreditType = 'store' | 'store';

export interface PharmacyCreditListItem {
  id: number;
  member_no: string;
  name: string;
  [key: string]: string | number;
}

export type PharmacyCreditDetail = PharmacyCreditListItem & {
  creditable: Partial<CreditSubmissionSubmissionDetail>;
  payment_histories: PaymentHistory[];
};
