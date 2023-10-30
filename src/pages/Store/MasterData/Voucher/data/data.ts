import { User } from '@/common/data/data';

export declare namespace VoucherFeature {
  type VoucherListItem = {
    id: number;
    user_id: number;
    name: string;
    amount: number;
    expired_at: string;
    status: string;
    created_at: string;
    updated_at: string;
    user: User;
  };

  type VoucherList = {
    current_page?: number;
    total?: number;
    data?: VoucherListItem[];
  };
}
