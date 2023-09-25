declare namespace AdjustmentFeature {
  type AdjustmentListItem = {
    id?: number;
    title?: string;
    status?: string;
    effective_date?: string;
    payroll_component: {
      id: number;
      type: string;
      name: string;
    };
  };

  type AdjustmentList = {
    current_page?: number;
    total?: number;
    data?: AdjustmentListItem[];
  };
}
