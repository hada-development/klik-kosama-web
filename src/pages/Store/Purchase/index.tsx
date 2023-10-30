import { publishStatuses } from '@/common/data/data';
import { formatDateTime, formatRupiah } from '@/common/utils/utils';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useRef } from 'react';
import { history } from 'umi';
import { PurchaseTableItem } from './data/data';
import { getPurchaseDataTable } from './data/services';

const PurchaseTable: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<PurchaseTableItem>[] = [
    {
      title: 'Tanggal',
      dataIndex: 'date',
      render: (data: any) => {
        return formatDateTime(data, 'DD-MM-YYYY');
      },
    },

    {
      title: 'No Invoice',
      dataIndex: 'invoice_no',
    },

    {
      title: 'Status',
      dataIndex: 'status',
      valueEnum: publishStatuses,
    },

    {
      title: 'Supplier',
      dataIndex: 'supplier_name',
      search: false,
    },

    {
      title: 'Total Pembelian',
      dataIndex: 'total_amount',
      search: false,
      render: (data: any) => formatRupiah(data),
    },

    {
      title: 'Catatan',
      search: false,
      dataIndex: 'note',
    },

    {
      title: 'Aksi',
      dataIndex: 'option',
      width: '8%',
      search: false,
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            history.push('/store/purchase/edit/' + record.id);
          }}
        >
          <EyeOutlined /> Detail
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<PurchaseTableItem, API.PageParams>
        scroll={{
          x: 'max-content',
        }}
        headerTitle="Daftar Pembelian"
        rowKey="id"
        actionRef={actionRef}
        search={{
          collapsed: false,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              history.push('/store/purchase/create');
            }}
          >
            <PlusOutlined /> Buat Dokumen
          </Button>,
        ]}
        request={getPurchaseDataTable}
        columns={columns}
      />
    </PageContainer>
  );
};

export default PurchaseTable;
