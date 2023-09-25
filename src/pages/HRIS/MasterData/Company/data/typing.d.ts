declare namespace CompanyFeature {
  type CompanyListItem = {
    id?: number;
    name?: string;
    alias?: string;
  };

  type CompanyList = {
    current_page?: number;
    total?: number;
    data?: CompanyListItem[];
  };
}
