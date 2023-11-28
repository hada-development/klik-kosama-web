// Receipt.tsx
import { formatDateTime, formatPrice, isoDateFormat } from '@/common/utils/utils';
import React, { useEffect } from 'react';
import { POSTransaction, mapPaymentMethodName } from '../data/data';

interface ReceiptProps {
  transaction?: POSTransaction;
  storeID: number;
}

const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(({ transaction, storeID }, ref) => {
  const padLeft = (span: string, total: number = 10) => {
    return span.padStart(total, '\u00A0');
  };

  const padRight = (span: string, total: number = 10) => {
    return span.padEnd(total, '\u00A0');
  };

  const createDashes = (count: number = 38) => {
    return '-'.repeat(count);
  };

  const getPageSize = () => {
    const heightBasis = 90 + 5 * (transaction?.details.length ?? 0);
    return `@media print { @page { size: 80mm ${heightBasis}mm }}`;
  };

  const getHeaderTitle = () => {
    console.log(storeID);
    if (storeID == 1) {
      return '"KOSAMART"';
    }
    if (storeID == 2) {
      return '"APOTEK"';
    }
    return '';
  };

  useEffect(() => {
    console.log(`RECEIPT STORE ID : ${storeID}`);
  }, [storeID]);

  return (
    <>
      {transaction && (
        <div ref={ref} style={{ width: 300, fontFamily: 'monospace', margin: '20px 1px' }}>
          <style>{getPageSize()}</style>
          <div style={{ textAlign: 'center' }}>
            {getHeaderTitle()}
            <span style={{ display: 'block' }}>KOPERASI SEJAHTERA BERSAMA (KOSAMA)</span>
            <span style={{ display: 'block' }}>PT. PLN INDONESIA POWER HEAD OFFICE</span>
            <span style={{ display: 'block' }}>Jl. JEND. GATOT SUBROTO KAV.18 KUNINGAN</span>
            <span style={{ display: 'block' }}>JAKARTA SELATAN, 12950</span>
            <span style={{ display: 'block' }}>{createDashes()}</span>
            <span style={{ display: 'block' }}>{createDashes()}</span>
          </div>

          <div style={{ marginTop: '10px' }}>
            <span style={{ display: 'block' }}>
              {padRight('ORDER NO', 14)}: {transaction.order_no}
            </span>
            <span style={{ display: 'block' }}>
              {padRight('KASIR', 14)}: {transaction.cashier.name.toUpperCase()}
            </span>
            <span style={{ display: 'block' }}>
              {padRight('TANGGAL', 14)}:{' '}
              {formatDateTime(transaction.created_at, 'DD/MM/YY HH:mm:ss', isoDateFormat)}
            </span>
            <span style={{ display: 'block' }}>{createDashes()}</span>
          </div>

          <div style={{ fontFamily: 'monospace' }}>
            {transaction.details.map((item, index) => (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{padRight(item.product_name, 20)}</span>
                <span>{padLeft(item.quantity.toString(), 3)}</span>
                <span>{formatPrice(item.unit_price, 6, false)}</span>
                <span>{formatPrice(item.total_price, 8)}</span>
              </div>
            ))}

            <span style={{ display: 'block' }}>{createDashes()}</span>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span>HARGA JUAL :</span>
              <span>{formatPrice(transaction.total_amount, 10)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span>DISKON :</span>
              <span>{formatPrice(transaction.discount ?? 0, 10)}</span>
            </div>
            <span style={{ display: 'block' }}>{createDashes()}</span>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span>TOTAL :</span>
              <span>{formatPrice(transaction.total_amount, 10)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span>{mapPaymentMethodName(transaction.payment_method.code).toUpperCase()} :</span>
              <span>{formatPrice(transaction.cash_received, 10)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span>KEMBALI :</span>
              <span>{formatPrice(transaction.cash_received - transaction.total_amount, 10)}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default Receipt;
