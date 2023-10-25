declare namespace SupplierFeature {
  type SupplierListItem = {
    id: number;
    name: string;
    description?: string;
    address?: string;
    npwp?: string;
  };

  type SupplierList = {
    current_page?: number;
    total?: number;
    data?: SupplierListItem[];
  };
}
