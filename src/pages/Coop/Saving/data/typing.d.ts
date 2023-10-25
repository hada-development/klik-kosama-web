declare namespace SavingFeature {
  type SavingSummaryMember = {
    member_id: number;
    member_name: string;
    member_no: string;
    member_type: string;
    member_status: string;
    total_saving: number;
    principal_saving: number;
    mandatory_saving: number;
    voluntary_saving: number;
    total_loan: number;
    total_paid: number;
    remaining_loan: number;
  };

  type SavingSummaryMemberList = {
    current_page: number;
    total: number;
    data: SavingSummaryMember[];
  };

  type SavingSummaryCompany = {
    total_saving: number;
    principal_saving: number;
    mandatory_saving: number;
    voluntary_saving: number;
  };
}
