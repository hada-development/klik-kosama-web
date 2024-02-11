import { POSTransaction, mapPMCode } from '@/pages/POS/data/data';

export interface SellingReport {
  summary: SellingSummary;
  days: SellingDay[];
}

export interface SellingSummary {
  bruto_sales: number;
  nett_sales: number;
  total_cogs: number;
  total_discount: number;
}

export interface SellingDay {
  transaction_date: string;
  bruto_sales: number;
  nett_sales: number;
  total_cogs: number;
  total_discount: number;
}

export interface TransactionReport {
  summary: TransactionSummary;
  transactions: POSTransaction[];
}

export interface TransactionSummary {
  total_transaction: number;
  total_sale: number;
  total_void: number;
}

export interface PaymentMethodReport {
  id: number;
  code: keyof typeof mapPMCode;
  total_transaction: number;
  total_amount: number;
}

export interface MemberReport {
  summary: MemberSummary;
  members: MemberSale[];
}

export interface MemberSummary {
  total_transaction: number;
  total_member: number;
  total_non_member: number;
}

export interface MemberSale {
  id: number;
  member_no: string;
  name: string;
  total_transaction: number;
  total_amount: number;
  total_cash: number;
  total_credit: number;

  total_p_transfer: number;
  total_p_qris: number;
  total_p_cash: number;
  total_p_credit: number;
  total_p_voucher: number;
}

export interface ProductSale {
  id: number;
  product_sku: string;
  product_name: string;
  total_item: number;
  total_sale: number;
}
