declare namespace LeaveSubmissionFeature {
  type LeaveSubmissionListItem = {
    id: number;
    quota: number;
    start_date: string;
    end_date: string;
    note?: string;
    total_days?: number;
    employee: {
      nip: string;
      user: {
        name;
      };
    };
    parent_submission: any;
  };

  type LeaveSubmissionList = {
    current_page?: number;
    total?: number;
    data?: LeaveSubmissionListItem[];
  };
}
