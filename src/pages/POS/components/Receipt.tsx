// Receipt.tsx
import { formatDateTime, formatPrice } from '@/common/utils/utils';
import { Card, Typography } from 'antd';
import React from 'react';
import { POSTransaction } from '../data/data';

const { Text } = Typography;

interface ReceiptProps {
  transaction: POSTransaction;
  paid: number;
  change: number;
}

const Receipt: React.FC<ReceiptProps> = ({ transaction, paid, change }) => {
  const padLeft = (text: string, total: number = 10) => {
    // Right-align the price within a 10-character width
    return text.padStart(total, '\u00A0');
  };

  const padRight = (text: string, total: number = 10) => {
    // Right-align the price within a 10-character width
    return text.padEnd(total, '\u00A0');
  };

  const createDashes = (count: number) => {
    return '-'.repeat(count);
  };

  return (
    <Card style={{ width: 300 }}>
      <div style={{ textAlign: 'center' }}>
        "KOSAMART"
        <Text style={{ display: 'block' }}>KOPERASI SEJAHTERA BERSAMA (KOSAMA)</Text>
        <Text style={{ display: 'block' }}>PT. PLN INDONESIA POWER HEAD OFFICE</Text>
        <Text style={{ display: 'block' }}>Jl. JEND. GATOT SUBROTO KAV.18 KUNINGAN</Text>
        <Text style={{ display: 'block' }}>JAKARTA SELATAN, 12950</Text>
        <Text style={{ display: 'block' }}>{createDashes(38)}</Text>
        <Text style={{ display: 'block' }}>{createDashes(38)}</Text>
      </div>

      <div style={{ marginTop: '10px' }}>
        <Text style={{ display: 'block' }}>
          {padRight('ORDER NO', 14)}: {transaction.order_no}
        </Text>
        <Text style={{ display: 'block' }}>
          {padRight('KASIR', 14)}: {transaction.cashier.name.toUpperCase()}
        </Text>
        <Text style={{ display: 'block' }}>
          {padRight('TANGGAL', 14)}: {formatDateTime(transaction.created_at, 'DD/MM/YY HH:mm:ss')}
        </Text>
        <Text style={{ display: 'block' }}>{createDashes(38)}</Text>
      </div>

      <div style={{ fontFamily: 'monospace' }}>
        {transaction.details.map((item, index) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text>{padRight(item.product_name, 20)}</Text>
            <Text>{padLeft(item.quantity.toString(), 3)}</Text>
            <Text>{formatPrice(item.unit_price, 6, false)}</Text>
            <Text>{formatPrice(item.total_price, 8)}</Text>
          </div>
        ))}

        <Text style={{ display: 'block' }}>{createDashes(38)}</Text>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Text>HARGA JUAL :</Text>
          <Text>{formatPrice(transaction.total_amount, 10)}</Text>
        </div>
        <Text style={{ display: 'block' }}>{createDashes(38)}</Text>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Text>TOTAL :</Text>
          <Text>{formatPrice(transaction.total_amount, 10)}</Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Text>TUNAI :</Text>
          <Text>{formatPrice(paid, 10)}</Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Text>KEMBALI :</Text>
          <Text>{formatPrice(change, 10)}</Text>
        </div>
      </div>
    </Card>
  );
};

export default Receipt;
