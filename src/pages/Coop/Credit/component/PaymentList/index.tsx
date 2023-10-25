import { formatRupiah } from '@/common/utils/utils';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Card } from 'antd';
import React, { useState } from 'react';
import { GoodsCreditDetail } from '../../GoodsCredit/data/data';
import { PaymentHistory, paymentStatus } from '../../data/data';
import PaymentFormModal from './EditModal';

type PaymentListProp = {
  credit: GoodsCreditDetail;
  payments: PaymentHistory[];
};

const PaymentList: React.FC<React.HTMLAttributes<HTMLElement> & PaymentListProp> = (prop) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [defaultAmount, setDefaultAmount] = useState<number | undefined>();
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | undefined>();

  const columns: ProColumns<PaymentHistory>[] = [
    {
      title: 'Periode',
      dataIndex: 'title',
    },
    {
      title: 'Tanggal',
      dataIndex: 'date',
    },
    {
      title: 'Pembayaran',
      dataIndex: 'amount',
      render: (data: any, _) => {
        if (data != '-') {
          return formatRupiah(data);
        }
        return data;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      valueEnum: paymentStatus,
    },
    {
      title: 'Note',
      dataIndex: 'note',
    },
    {
      title: 'Action',
      dataIndex: 'title',
      width: '80px',
      render: (_, record) => {
        return record.id ? (
          <Button
            type="link"
            onClick={() => {
              setSelectedPayment(record);
              setDefaultAmount(undefined);
              setIsModalOpen(true);
            }}
          >
            <EditOutlined /> Edit
          </Button>
        ) : null;
      },
    },
  ];

  return (
    <>
      <Card
        {...prop}
        title={'Pembayaran'}
        extra={
          <Button
            className="hide-on-print"
            onClick={() => {
              setSelectedPayment(undefined);
              setDefaultAmount(prop.credit.sell_price / prop.credit.installment_term);
              setIsModalOpen(true);
            }}
          >
            <PlusOutlined /> Tambah Pembayaran
          </Button>
        }
      >
        <ProTable<PaymentHistory>
          search={false}
          toolBarRender={false}
          columns={columns}
          pagination={false}
          dataSource={prop.payments}
          key={'title'}
        ></ProTable>
      </Card>
      <PaymentFormModal
        creditId={prop.credit.id}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        defaultAmount={defaultAmount}
        payment={selectedPayment}
        onUpdate={() => {
          window.location.reload();
        }}
      />
    </>
  );
};

export default PaymentList;
