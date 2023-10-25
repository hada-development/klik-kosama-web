export interface PurchaseTableItem {
  id: number;
  status: string;
  created_at: string;
}

export interface PurchaseItem {
  product_id: number;
  quantity: number;
  unit_price: number;
}
