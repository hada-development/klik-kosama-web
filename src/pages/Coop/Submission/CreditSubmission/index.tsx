import { formatDateTime, formatRupiah } from '@/common/utils/utils';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button } from 'antd';
import React, { useRef, useState } from 'react';
import { CreditSubmissionSubmissionItem } from './data/data';
import { getCreditSubmissionSubmission } from './data/service';

const CreditSubmissionSubmissionPage: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<CreditSubmissionSubmissionItem | undefined>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, handleDeleteModalOpen] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<CreditSubmissionSubmissionItem[]>([]);

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<CreditSubmissionSubmissionItem>[] = [
    {
      title: 'No. Pengajuan',
      dataIndex: 'number',
      render: (data, record) => [
        <a
          key="show"
          onClick={() => {
            history.push(`/coop/submission/credit/${record.id}`);
          }}
        >
          {data}
        </a>,
      ],
    },
    {
      title: 'Anggota',
      dataIndex: 'name',
    },
    {
      title: 'Tanggal Pengajuan',
      dataIndex: 'date',
      search: false,
      render: (data: any, _) => {
        return formatDateTime(data, 'DD/MMM/YYYY', 'YYYY-MM-DDTHH:mm:ss.SSSSSSZ');
      },
    },

    {
      title: 'Status',
      dataIndex: 'status',
      search: false,
    },

    {
      title: 'Barang / Keperluan',
      dataIndex: 'note',
      search: false,
    },

    {
      title: 'Harga Jual',
      dataIndex: 'sell_price',
      search: false,
      render: (data, _) => {
        return formatRupiah(data);
      },
    },
    {
      title: 'Harga Beli',
      dataIndex: 'buy_price',
      search: false,
      render: (data, _) => {
        return formatRupiah(data);
      },
    },
    {
      title: 'Margin',
      dataIndex: 'margin',
      search: false,
      render: (data, _) => {
        return formatRupiah(data);
      },
    },

    {
      title: 'Aksi',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="show"
          onClick={() => {
            history.push(`/coop/submission/credit/${record.id}`);
          }}
        >
          <EyeOutlined /> Lihat
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<CreditSubmissionSubmissionItem, API.PageParams>
        headerTitle="Daftar Kredit"
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 200,
        }}
        request={getCreditSubmissionSubmission}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        scroll={{
          x: 'max-content',
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCurrentRow(undefined);
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> Tambah
          </Button>,
        ]}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              Dipilih <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> Item
              &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              // await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            Batch Deletion
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};

export default CreditSubmissionSubmissionPage;
