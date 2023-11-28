export declare namespace VoucherFeature {
  type VoucherListItem = {
    id: number;
    barcode: string;
    name: string;
    amount: number;
    expired_at: string;
    status: string;
    created_at: string;
    updated_at: string;
  };

  type VoucherList = {
    current_page?: number;
    total?: number;
    data?: VoucherListItem[];
  };
}
