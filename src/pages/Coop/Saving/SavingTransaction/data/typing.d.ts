declare namespace SavingTransactionFeature {
  type SavingTransactionListItem = {
    id: number;
    member_name: string;
    member_no: string;
    saving_type: string;
    transaction_type: string;
    entry_type: string;
    amount: number;
    note: number;
    created_at: number;
  };

  type SavingTransactionList = {
    current_page?: number;
    total?: number;
    data?: SavingTransactionListItem[];
  };
}
