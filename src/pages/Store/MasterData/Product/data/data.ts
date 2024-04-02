export interface ProductTableItem {
  id: number;
  category_id: number;
  name: string;
  printed_name: string;
  sku: string;
  uom: string;
  description: string;
  image_file_id: any;
  sell_price: number;
  buy_price: number;
  barcodes: Barcode[];
  category: Category;
  image: Image | null;
}

export interface Image {
  id: number;
  address: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Barcode {
  id: number;
  product_id: number;
  value: string;
  is_enabled: boolean;
}
