declare namespace MemberFeature {
  type MemberListItem = {
    id?: number;
    user_id?: number;
    member_no?: string;
    type?: string;
    status?: string;
    user?: User;
  };

  type MemberList = {
    current_page?: number;
    total?: number;
    data?: MemberListItem[];
  };

  type User = {
    id?: number;
    name?: string;
    email?: string;
    profile_photo?: ProfilePhoto;
    personal_data?: PersonalData;
    bank_account?: BankAccount;
    company_data?: any;
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
