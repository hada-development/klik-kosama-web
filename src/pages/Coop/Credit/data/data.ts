import { File } from '@/common/data/data';
import { ProSchemaValueEnumObj } from '@ant-design/pro-components';

export interface Payment {
  id: number;
  credit_id: number;
  date: string;
  amount: number;
  note: string;
  file_id: any;
  created_by: number;
  created_at: string;
  updated_at: string;
  file?: File;
}

export const paymentStatus: ProSchemaValueEnumObj = {
  paid: {
    text: 'Dibayar',
    status: 'Success',
  },
  unpaid: {
    text: '-',
    status: 'Default',
  },
};

export interface PaymentHistory {
  title: string;
  amount?: number;
  date?: string;
  status: string;
  id?: number;
  note?: string;
}
