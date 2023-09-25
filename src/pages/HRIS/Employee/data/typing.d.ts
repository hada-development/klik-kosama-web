declare namespace EmployeeFeature {
  type EmployeeListItem = {
    id?: number;
    user_id?: number;
    hr_employee_type_id?: number;
    hr_position_id?: number;
    hr_office_id?: number;
    hr_education_level_id?: number;
    nip?: string;
    join_date?: string;
    education_note?: string;
    company?: CompanyFeature.CompanyListItem;
    position?: PositionFeature.PositionListItem;
    employee_type?: EmployeeTypeFeature.EmployeeTypeListItem;
    shift?: {
      id: number;
      name: string;
    };
    user?: User;
  };

  type EmployeeList = {
    current_page?: number;
    total?: number;
    data?: EmployeeListItem[];
  };

  type User = {
    id?: number;
    name?: string;
    email?: string;
    profile_photo?: ProfilePhoto;
    personal_data?: PersonalData;
    bank_account?: BankAccount;
  };

  type ProfilePhoto = {
    file?: {
      address?: string;
      thumbnail?: string;
    };
  };

  type PersonalData = {
    nik?: string | null;
    phone_number?: string | null;
    gender?: string | null;
    birth_place?: string | null;
    birth_date?: string | null;
    marital_status?: string | null;
    religion?: string | null;
    address?: string | null;
  };

  type BankAccount = {
    bank_id?: number | null;
    account_number?: string | null;
    account_name?: string | null;
    branch_name?: string | null;
    bank?: {
      id: number;
      name: string;
    };
  };
}
