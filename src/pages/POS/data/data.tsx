import { Member, User } from '@/common/data/data';
import { FieldTimeOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Tag } from 'antd';

export interface POSProduct {
  id: number;
  name: string;
  sku: string;
  sell_price: number;
  stock: number;
}

export interface POSItem {
  product_id: number;
  product: POSProduct;
  quantity: number;
  subTotal: number;
}

export interface POSMember {
  id: number;
  name: string;
  user_id: number;
  member_no: string;
  type: string;
}

export interface POSVoucher {
  id: number;
  barcode: string;
  name: string;
  amount: number;
  expired_at: string;
  status: string;
}

export interface POSPaymentMethod {
  id: number;
  code: keyof typeof mapPMCode;
  name?: string;
  icon_image_url?: string;
}

export interface POSTransaction {
  id: number;
  order_no: string;
  total_item: number;
  total_amount: number;
  total_price: number;
  cash_received: number;
  tax: number;
  discount?: number;
  note?: string;
  cashier: POSCashier;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  details: POSTrxDetail[];
  payment_method: POSPaymentMethod;
  member?: Member;
}

export interface POSCashier {
  name: string;
}

export interface POSTrxDetail {
  id: number;
  product_id: number;
  product_sku: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

// ========= APP ORDER ==========

export interface AppOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_sku: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  updated_at: string;
}
export interface AppOrder {
  id: number;
  order_no: string;
  user_id: number;
  store_id: number;
  payment_method_id: number;
  status: keyof typeof mapAppOrderStatus;
  total_item: number;
  total_amount: number;
  tax: number;
  discount: number;
  voucher_id: number | null;
  expired_at: string;
  created_at: string;
  updated_at: string;
  user: User;
  items: AppOrderItem[];
  payment_method: POSPaymentMethod;
  confirmations: AppOrderConfirmation[];
}

export interface AppOrderListItem {
  id: number;
  order_no: string;
  member_name: string;
  member_no: string;
  payment_method_code: keyof typeof mapPMCode;
  status: keyof typeof mapAppOrderStatus;
  total_shopping: number;
  date: string;
  item_product_name: string;
  item_quantity: number;
  item_other_count: number;
}

export const mapAppOrderStatus = {
  'waiting-for-payment': 'Mengunggu Pembayaran',
  'waiting-for-confirmation': 'Mengunggu Konfirmasi',
  'ready-to-pickup': 'Siap Diambil',
  canceled: 'Dibatalkan',
  done: 'Selesai',
};

export const mapAppOrderButton = {
  'waiting-for-payment': null,
  'waiting-for-confirmation': 'Konfirmasi',
  'ready-to-pickup': 'Sudah Diambil',
  canceled: null,
  done: null,
};

export const mapAppOrderAction = {
  'waiting-for-payment': null,
  'waiting-for-confirmation': 'ready-to-pickup',
  'ready-to-pickup': 'done',
  canceled: null,
  done: null,
};

export const mapAppOrderStatusTag = {
  'waiting-for-payment': <Tag color="default">Menunggu Pembayaran</Tag>,
  'waiting-for-confirmation': <Tag color="orange">Menunggu Konfirmasi</Tag>,
  'ready-to-pickup': <Tag color="success">Siap Diambil</Tag>,
  canceled: <Tag color="error">Dibatalkan</Tag>,
  done: <Tag color="blue">Selesai</Tag>,
};

export const mapOrderStatusName = (status: keyof typeof mapAppOrderStatus) => {
  return mapAppOrderStatus[status] ?? '';
};

export interface AppOrderConfirmation {
  id: number;
  total_paid: number;
  date: string;
  note: string;
  image_url?: string;
}

// =================== APP ORDER =======================

export const mapPMCode = {
  qris: 'QRIS',
  cash: 'Tunai',
  credit: 'Kredit',
};

export const mapPMIcon = {
  qris: <QrcodeOutlined style={{ fontSize: '24px' }} />,
  cash: (
    <h4 style={{ fontSize: '24px', lineHeight: '24px', marginBottom: '0px', display: 'inline' }}>
      Rp
    </h4>
  ),
  credit: <FieldTimeOutlined style={{ fontSize: '24px' }} />,
};

export const mapPaymentMethodName = (code: keyof typeof mapPMCode) => {
  return mapPMCode[code] ?? '';
};

export const mapPaymentMethodIcon = (code: keyof typeof mapPMCode) => {
  return mapPMIcon[code] ?? '';
};

export const disabledIfCreditNoMember = (code: keyof typeof mapPMCode, hasMember: boolean) => {
  return code == 'credit' && !hasMember;
};
