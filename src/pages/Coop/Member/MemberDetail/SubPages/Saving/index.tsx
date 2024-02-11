import { formatDateTime, formatRupiah } from '@/common/utils/utils';
import { MemberSaving } from '@/pages/Coop/Member/data/data';
import { getMemberSavings } from '@/pages/Coop/Member/data/services/service';
import { savingTypes, transactionTypes } from '@/pages/Coop/Saving/data/data';
import { useParams } from '@@/exports';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import Paragraph from 'antd/es/typography/Paragraph';
import React from 'react';

const SavingSubPage: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();

  const columns: ProColumns<MemberSaving>[] = [
    {
      title: 'Tanggal',
      dataIndex: 'created_at',
      render: (data: any) => {
        return formatDateTime(data, 'DD/MMM/YYYY');
      },
    },
    {
      title: 'Jenis Simpanan',
      dataIndex: 'saving_type',
      valueEnum: savingTypes,
    },
    {
      title: 'Jenis Transaksi',
      dataIndex: 'transaction_type',
      valueEnum: transactionTypes,
      width: '150px',
    },
    {
      title: 'Nominal',
      dataIndex: 'amount',
      search: false,
      render: (data) => {
        return formatRupiah(data);
      },
    },
    {
      title: 'Note',
      dataIndex: 'note',
      render: (data) => {
        return (
          <Paragraph ellipsis={{ rows: 1, expandable: true, symbol: 'more' }}>{data}</Paragraph>
        );
      },
    },
  ];

  return (
    <>
      <ProTable<MemberSaving, API.PageParams>
        headerTitle="Simpanan"
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        cardProps={{
          size: 'small',
        }}
        columns={columns}
        request={(params, options) => getMemberSavings(memberId!, params, options)}
      />
    </>
  );
};

export default SavingSubPage;
