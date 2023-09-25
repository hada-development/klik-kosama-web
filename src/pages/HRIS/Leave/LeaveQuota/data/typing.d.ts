declare namespace LeaveQuotaFeature {
  type LeaveQuotaListItem = {
    id: number;
    quota: number;
    start_period: string;
    end_period: string;
    employee: {
      nip: string;
      user: {
        name;
      };
    };
  };

  type LeaveQuotaList = {
    current_page?: number;
    total?: number;
    data?: LeaveQuotaListItem[];
  };
}
