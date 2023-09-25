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
import { VoluntaryWithdrawSubmissionItem } from './data/data';
import { getVoluntaryWithdrawSubmission } from './data/service';

const VoluntaryWithdrawSubmissionPage: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<VoluntaryWithdrawSubmissionItem | undefined>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, handleDeleteModalOpen] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<VoluntaryWithdrawSubmissionItem[]>([]);

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<VoluntaryWithdrawSubmissionItem>[] = [
    {
      title: 'No. Pengajuan',
      dataIndex: 'number',
      render: (data, record) => [
        <a
          key="show"
          onClick={() => {
            history.push(`/coop/submission/voluntary-withdraw/${record.id}`);
          }}
        >
          {data}
        </a>,
      ],
    },
    {
      title: 'Nama Anggota',
      dataIndex: 'member_name',
    },
    {
      title: 'No. Anggota',
      dataIndex: 'member_no',
    },

    {
      title: 'Jumlah',
      dataIndex: 'amount',
      search: false,
      render: (data, _) => {
        return formatRupiah(data);
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      search: false,
    },
    {
      title: 'Tanggal',
      dataIndex: 'date',
      search: false,
      render: (data: any, _) => {
        return formatDateTime(data, 'DD/MMM/YYYY', 'YYYY-MM-DDTHH:mm:ss.SSSSSSZ');
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
            history.push(`/coop/submission/voluntary-withdraw/${record.id}`);
          }}
        >
          <EyeOutlined /> Lihat
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<VoluntaryWithdrawSubmissionItem, API.PageParams>
        headerTitle="Daftar Transaksi Simpanan"
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 200,
        }}
        request={getVoluntaryWithdrawSubmission}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
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

export default VoluntaryWithdrawSubmissionPage;
