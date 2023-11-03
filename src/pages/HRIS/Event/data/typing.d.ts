declare namespace EventFeature {
  type EventListItem = {
    id: number;
    name: string;
    description?: string;
    address?: string;
    npwp?: string;
  };

  type EventList = {
    current_page?: number;
    total?: number;
    data?: EventListItem[];
  };
}
