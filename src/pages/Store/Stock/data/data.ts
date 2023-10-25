import { User } from '@/common/data/data';
import { Barcode } from '../../MasterData/Product/data/data';

export const stockStatuses = {
  in_stock: { text: 'In Stock', status: 'Success' },
  restock: { text: 'Restok', status: 'Warning' },
  empty: { text: 'Kosong', status: 'Default' },
  negative: { text: 'Negatif', status: 'Error' },
};

export const stockTrxTypes = [
  { value: 'inc', label: 'Increment (Penambahan)' },
  { value: 'dec', label: 'Decrement (Pengurangan)' },
  { value: 'adj', label: 'Adjusment (Penyesuaian)' },
];

export interface StockTableItem {
  id: number;
  stock_id: number;
  name: string;
  sku: string;
  uom: string;
  quantity: number;
  restock_level: number;
  stock_status: string;
  sell_price: number;
  buy_price: number;
  barcodes: Barcode[];
}

export interface StockHistoryItem {
  id: number;
  user_id: number;
  ks_product_stock_id: number;
  type: string;
  quantity: number;
  balance: number;
  notes: string;
  created_at: string;
  updated_at: string;
  user: User;
}
