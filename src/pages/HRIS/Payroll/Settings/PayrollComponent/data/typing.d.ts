declare namespace PayrollComponentFeature {
  type PayrollComponentListItem = {
    id?: number;
    name?: boolean;
  };

  type PayrollComponentList = {
    current_page?: number;
    total?: number;
    data?: PayrollComponentListItem[];
  };
}
