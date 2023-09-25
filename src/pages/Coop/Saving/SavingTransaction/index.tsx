import { formatDateTime, formatRupiah } from '@/common/utils/utils';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Modal, message } from 'antd';
import React, { useRef, useState } from 'react';
import { savingTypes, transactionTypes } from '../data/data';
import SavingTransactionForm from './components/SavingTransactionForm';
import { deleteSavingTransaction, getSavingTransaction } from './data/services/service';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (
  selectedRow: SavingTransactionFeature.SavingTransactionListItem | undefined,
) => {
  const hide = message.loading('Mohon Tunggu');
  if (!selectedRow) return true;
  try {
    await deleteSavingTransaction(selectedRow.id);
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error: any) {
    hide();
    let errorMessage: string | undefined = error.response?.data?.message;
    if (errorMessage) {
      message.error(errorMessage);
      return false;
    }
    message.error('Delete failed, please try again');
    return false;
  }
};

const SavingTransactionPage: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<
    SavingTransactionFeature.SavingTransactionListItem | undefined
  >();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, handleDeleteModalOpen] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<
    SavingTransactionFeature.SavingTransactionListItem[]
  >([]);

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<SavingTransactionFeature.SavingTransactionListItem>[] = [
    {
      title: 'Tanggal',
      dataIndex: 'created_at',
      render: (data: any, _) => {
        return formatDateTime(data, 'DD/MMM/YYYY');
      },
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
      title: 'Jenis Simpanan',
      dataIndex: 'saving_type',
      valueEnum: savingTypes,
    },
    {
      title: 'Jenis Transaksi',
      dataIndex: 'transaction_type',
      valueEnum: transactionTypes,
    },
    {
      title: 'Nominal',
      dataIndex: 'amount',
      search: false,
      render: (data, _) => {
        return formatRupiah(data);
      },
    },
    {
      title: 'Aksi',
      dataIndex: 'option',
      width: '15%',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            handleModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <EditOutlined /> Edit
        </a>,
        <a
          key="delete"
          onClick={() => {
            handleDeleteModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <DeleteOutlined /> Hapus
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<SavingTransactionFeature.SavingTransactionListItem, API.PageParams>
        headerTitle="Daftar Transaksi Simpanan"
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 200,
        }}
        request={getSavingTransaction}
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
      <SavingTransactionForm
        onCancel={() => {}}
        onSubmit={async (value) => {
          if (actionRef.current) {
            actionRef.current.reload();
          }
          return true;
        }}
        values={currentRow}
        open={createModalOpen}
        setOpen={handleModalOpen}
      />

      <Modal
        title="Confirm Delete"
        open={deleteModalOpen}
        onCancel={() => handleDeleteModalOpen(false)}
        onOk={async () => {
          await handleRemove(currentRow);
          if (actionRef.current) {
            actionRef.current.reload();
          }
          handleDeleteModalOpen(false);
        }}
      >
        Anda yakin ingin menghapus jabatan ini?
      </Modal>
    </PageContainer>
  );
};

export default SavingTransactionPage;
