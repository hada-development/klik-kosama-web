import { formatDateTime, formatRupiah, isoDateFormat } from '@/common/utils/utils';
import TransactionDetail from '@/pages/POS/components/TransactionHistory/detail';
import { POSTransaction, mapPaymentMethodName } from '@/pages/POS/data/data';
import { EyeOutlined } from '@ant-design/icons';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Tag } from 'antd';
import React, { useState } from 'react';

interface TransactionReportTableProps {
  data: POSTransaction[]; // Replace YourSummaryDataType with the actual data type.
}

const TransactionReportTable: React.FC<TransactionReportTableProps> = ({ data }) => {
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [selectedTrx, setSelectedTrx] = useState<POSTransaction | undefined>();

  const columns: ProColumns<POSTransaction, 'text'>[] = [
    {
      title: 'Waktu',
      dataIndex: 'created_at',
      key: 'date',
      render: (text: any) => {
        return formatDateTime(text, 'DD/MM/YYYY HH:mm:ss', isoDateFormat);
      },
    },
    {
      title: 'No Order',
      dataIndex: 'order_no',
      key: 'orderNo',
    },
    {
      title: 'Anggota',
      dataIndex: ['member', 'name'],
      key: 'anggota',
    },
    {
      title: 'Status',
      dataIndex: 'deleted_at',
      key: 'status',
      render: (text: any) => {
        if (text == '-') {
          return <Tag color="green">SALE</Tag>;
        }
        return <Tag color="magenta">VOID</Tag>;
      },
    },
    {
      title: 'Pembayaran',
      dataIndex: ['payment_method', 'code'],
      key: 'payment',
      render: (text: any) => {
        return mapPaymentMethodName(text);
      },
    },
    {
      title: 'Total Barang',
      dataIndex: 'total_item',
      key: 'totalItem',
      align: 'center' as 'center',
    },

    {
      title: 'Nominal',
      dataIndex: 'total_amount',
      key: 'totalAmount',
      align: 'right' as 'right',
      render: (text: any) => {
        return formatRupiah(text);
      },
    },

    {
      title: '',
      key: 'action',
      width: 5,
      render: (text: any, record: POSTransaction) => (
        <Button type="primary" onClick={() => handleShowDetail(record)}>
          <EyeOutlined />
        </Button>
      ),
    },
  ];

  const handleShowDetail = (trx: POSTransaction) => {
    setSelectedTrx(trx);
    setOpenDetail(true);
  };

  return (
    <>
      <ProTable<POSTransaction>
        headerTitle="Transaksi"
        rowKey={'id'}
        dataSource={data}
        search={false}
        columns={columns}
      />

      <TransactionDetail
        transaction={selectedTrx}
        readonly={true}
        open={openDetail}
        onClose={() => setOpenDetail(false)}
      />
    </>
  );
};

export default TransactionReportTable;
