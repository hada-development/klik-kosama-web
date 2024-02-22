import { publishStatuses } from '@/common/data/data';
import { formatDateTime, formatRupiah } from '@/common/utils/utils';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { history, useModel } from 'umi';
import StoreSelection from '../components/StoreSelection';
import { PurchaseTableItem } from './data/data';
import { getPurchaseDataTable } from './data/services';

const PurchaseTable: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const { storeID } = useModel('Store.useStore');

  useEffect(() => {
    actionRef.current?.reloadAndRest?.();
  }, [storeID]);

  const columns: ProColumns<PurchaseTableItem>[] = [
    {
      title: 'Tanggal',
      dataIndex: 'date',
      valueType: 'date',

      fieldProps: {
        placeholder: 'YYYY-MM-DD',
        allowClear: true,
      },
      width: 120,
      renderText: (data: any) => {
        return moment(formatDateTime(data, 'YYYY-MM-DD')).toDate();
      },
    },

    {
      title: 'No Invoice',
      dataIndex: 'invoice_no',
    },

    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
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
    <PageContainer extra={<StoreSelection />}>
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
        request={(params, options) => getPurchaseDataTable(storeID, params, options)}
        columns={columns}
      />
    </PageContainer>
  );
};

export default PurchaseTable;
