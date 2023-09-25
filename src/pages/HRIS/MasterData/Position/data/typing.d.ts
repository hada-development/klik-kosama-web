declare namespace PositionFeature {
  type PositionListItem = {
    id?: number;
    name?: string;
    position_level: {
      name: string;
    };
  };

  type PositionList = {
    current_page?: number;
    total?: number;
    data?: PositionListItem[];
  };
}
