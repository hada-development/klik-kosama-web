declare namespace PayrollTemplateFeature {
  type PayrollTemplateListItem = {
    id: number;
    name?: string;
    description?: string;
    items?: PayrollTemplateItem[];
  };

  type PayrollTemplateList = {
    current_page?: number;
    total?: number;
    data?: PayrollComponentListItem[];
  };

  type PayrollTemplateItem = {
    id: number;
    hr_payroll_component_id?: number;
    hr_payroll_formula_id: number;
    fixed_amount?: any;
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
}
