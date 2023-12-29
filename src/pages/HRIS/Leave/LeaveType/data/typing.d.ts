declare namespace LeaveTypeFeature {
  type LeaveTypeListItem = {
    id: number;
    name: string;
  };

  type LeaveTypeList = {
    current_page?: number;
    total?: number;
    data?: LeaveTypeListItem[];
  };
}
