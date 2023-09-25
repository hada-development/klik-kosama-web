declare namespace PositionLevelFeature {
  type PositionLevelListItem = {
    id?: number;
    name?: boolean;
  };

  type PositionLevelList = {
    current_page?: number;
    total?: number;
    data?: PositionLevelListItem[];
  };
}
