declare namespace OvertimeSubmissionFeature {
  type OvertimeSubmissionListItem = {
    id: number;
    quota: number;
    date: string;
    start_time: string;
    end_time: string;
    minutes?: number;
    note?: string;
    parent_submission: any;
    file?: any;
  };

  type OvertimeSubmissionList = {
    current_page?: number;
    total?: number;
    data?: OvertimeSubmissionListItem[];
  };
}
