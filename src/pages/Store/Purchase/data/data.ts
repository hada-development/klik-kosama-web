import { File } from '@/common/data/data';
import { ProductTableItem } from '../../MasterData/Product/data/data';

export interface PurchaseTableItem {
  id: number;
  status: string;
  invoice_no: string;
  created_at: string;
  supplier_name: string;
  date: string;
  total_amount: number;
  supplier: SupplierFeature.SupplierListItem;
  note: string;
}

export interface PurchaseDetail {
  id: number;
  status: string;
  created_at: string;
  invoice_no: string;
  supplier_name: string;
  supplier_id: string;
  date: string;
  total_amount: number;
  supplier: SupplierFeature.SupplierListItem;
  note: string;
  items: PurchaseItem[];
  file?: File;
}

export interface PurchaseItem {
  id: number;
  product_id?: number;
  quantity?: number;
  unit_price?: number;
  sub_total?: number;
  product?: ProductTableItem;
}
