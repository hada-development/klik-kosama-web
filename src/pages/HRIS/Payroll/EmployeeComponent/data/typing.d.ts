declare namespace EmployeeComponentFeature {
  type EmployeeComponentListItem = {
    employee_id?: number;
    name?: string;
    company?: string;
    nip?: string;
    position?: string;
    employee_type?: string;
  };

  type EmployeeComponentList = {
    current_page?: number;
    total?: number;
    data?: EmployeeComponentListItem[];
  };

  type PayrollComponentItem = {
    id: number;
    hr_employee_id?: number;
    hr_payroll_component_id?: number;
    amount?: any;
    component?: PayrollComponent;
    formula?: PayrollFormula;
  };

  type PayrollComponent = {
    id: number;
    type: string;
    name: string;
  };

  type PayrollFormula = {
    id: number;
    name: string;
    description: string;
  };

  type EmployeePayrollComponentDTO = {
    employee_id: number;
    items: Partial<EmployeePayrollComponentItemDTO>[];
  };

  type EmployeePayrollComponentItemDTO = {
    component_id: number;
    formula_id?: number;
    amount?: number;
  };

  type PayrollTemplate = {
    id: number;
    name: string;
    description: string;
  };

  type ResponseData<T> = {
    data: T[];
  };
}
