declare namespace ShiftFeature {
  type ShiftListItem = {
    id?: number;
    name?: string;
    start_time?: string;
    end_time?: string;
  };

  type ShiftList = {
    current_page?: number;
    total?: number;
    data?: ShiftListItem[];
  };
}
