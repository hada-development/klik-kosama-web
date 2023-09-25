declare namespace EmployeeTypeFeature {
  type EmployeeTypeListItem = {
    id?: number;
    name?: string;
  };

  type EmployeeTypeList = {
    current_page?: number;
    total?: number;
    data?: EmployeeTypeListItem[];
  };
}
