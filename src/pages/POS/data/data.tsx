import { FieldTimeOutlined, QrcodeOutlined } from '@ant-design/icons';

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
  user_id: number;
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
  tax: number;
  discount?: number;
  note?: string;
  cashier: POSCashier;
  created_at: string;
  updated_at: string;
  details: POSTrxDetail[];
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

export interface Member {
  id: number;
  name: string;
  member_no: string;
}

export const mapPMCode = {
  qris: 'QRIS',
  cash: 'Tunai',
  credit: 'Kredit',
};

export const mapPMIcon = {
  qris: <QrcodeOutlined style={{ fontSize: '24px' }} />,
  cash: <h4 style={{ fontSize: '24px', lineHeight: '24px', marginBottom: '0px' }}>Rp</h4>,
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
