import { formatDateTime } from '@/common/utils/utils';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Modal, message } from 'antd';
import React, { useRef, useState } from 'react';
import LeaveQuotaForm from './components/LeaveQuotaForm';
import { deleteLeaveQuota, getLeaveQuota } from './data/services/service';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRow: LeaveQuotaFeature.LeaveQuotaListItem | undefined) => {
  const hide = message.loading('Mohon Tunggu');
  if (!selectedRow) return true;
  try {
    await deleteLeaveQuota(selectedRow.id);
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

const LeaveQuotaPage: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<LeaveQuotaFeature.LeaveQuotaListItem | undefined>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  const [selectedRowsState, setSelectedRows] = useState<LeaveQuotaFeature.LeaveQuotaListItem[]>([]);
  const [{ confirm }, contextHolder] = Modal.useModal();

  const actionRef = useRef<ActionType>();

  const onDelete = (record: LeaveQuotaFeature.LeaveQuotaListItem) => {
    confirm({
      title: 'Anda yakin ingin menghapus data ini?',
      icon: <ExclamationCircleFilled />,
      content: 'Data yang dihapus tidak dapat dikembalikan',
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batalkan',
      closable: true,
      onOk: async () => {
        await handleRemove(record);
        actionRef.current?.reloadAndRest?.();
      },
      onCancel: () => {
        console.log('NO');
      },
    });
  };

  const columns: ProColumns<LeaveQuotaFeature.LeaveQuotaListItem>[] = [
    {
      title: 'Pegawai',
      dataIndex: ['employee', 'user', 'name'],
      search: {
        transform: (value) => ({
          'users.name': value,
        }), // Set the custom search parameter name
      },
    },
    {
      title: 'Awal Periode',
      dataIndex: 'start_period',
      render: (_, record) => formatDateTime(record.start_period, 'DD/MM/YYYY'),
    },
    {
      title: 'Akhir Periode',
      dataIndex: 'end_period',
      render: (_, record) => formatDateTime(record.end_period, 'DD/MM/YYYY'),
    },
    {
      title: 'Kuota',
      dataIndex: 'quota',
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
            onDelete(record);
          }}
        >
          <DeleteOutlined /> Hapus
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      {contextHolder}
      <ProTable<LeaveQuotaFeature.LeaveQuotaListItem, API.PageParams>
        headerTitle="Daftar Kuota Cuti"
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 120,
        }}
        request={getLeaveQuota}
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
      <LeaveQuotaForm
        onCancel={() => {}}
        onSubmit={async () => {
          if (actionRef.current) {
            actionRef.current.reload();
          }
          return true;
        }}
        values={currentRow}
        open={createModalOpen}
        setOpen={handleModalOpen}
      />
    </PageContainer>
  );
};

export default LeaveQuotaPage;
