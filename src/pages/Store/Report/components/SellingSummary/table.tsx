import { formatRupiah } from '@/common/utils/utils';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import React from 'react';
import { SellingDay } from '../../data/data';

interface SellingSummaryTableProps {
  data: SellingDay[]; // Replace YourSummaryDataType with the actual data type.
}

const SellingSummaryTable: React.FC<SellingSummaryTableProps> = ({ data }) => {
  const columns: ProColumns<SellingDay, 'text'>[] = [
    {
      title: 'Tanggal',
      dataIndex: 'transaction_date',
      key: 'date',
    },
    {
      title: 'Penjualan Kotor',
      dataIndex: 'bruto_sales',
      key: 'brutoSales',
      align: 'right' as 'right',
      render: (text: any) => {
        return formatRupiah(text);
      },
    },
    {
      title: 'Harga Pokok',
      dataIndex: 'total_cogs',
      key: 'totalCogs',
      align: 'right' as 'right',
      render: (text: any) => {
        return formatRupiah(text);
      },
    },
    {
      title: 'Penjualan Bersih',
      dataIndex: 'nett_sales',
      key: 'nettSales',
      align: 'right' as 'right',
      render: (text: any) => {
        return formatRupiah(text);
      },
    },
    // Add more columns as needed
  ];

  return (
    <ProTable<SellingDay>
      headerTitle="Penjualan"
      rowKey={'transaction_date'}
      dataSource={data}
      search={false}
      columns={columns}
    />
  );
};

export default SellingSummaryTable;
