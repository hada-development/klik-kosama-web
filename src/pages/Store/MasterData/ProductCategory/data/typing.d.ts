declare namespace ProductCategoryFeature {
  type ProductCategoryListItem = {
    id?: number;
    name?: string;
  };

  type ProductCategoryList = {
    current_page?: number;
    total?: number;
    data?: ProductCategoryListItem[];
  };
}
