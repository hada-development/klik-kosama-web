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
import ShiftForm from './components/ShiftForm';
import { deleteShift, getShift } from './data/services/service';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRow: ShiftFeature.ShiftListItem | undefined) => {
  const hide = message.loading('Mohon Tunggu');
  if (!selectedRow) return true;
  try {
    await deleteShift(selectedRow.id);
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

const ShiftPage: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<ShiftFeature.ShiftListItem | undefined>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, handleDeleteModalOpen] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<ShiftFeature.ShiftListItem[]>([]);
  const [{ confirm }, contextHolder] = Modal.useModal();

  const actionRef = useRef<ActionType>();

  const onDelete = (record: ShiftFeature.ShiftListItem) => {
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

  const columns: ProColumns<ShiftFeature.ShiftListItem>[] = [
    {
      title: 'Nama Shift',
      dataIndex: 'name',
    },
    {
      title: 'Jam Masuk',
      dataIndex: 'start_time',
    },
    {
      title: 'Jam Pulang',
      dataIndex: 'end_time',
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
      <ProTable<ShiftFeature.ShiftListItem, API.PageParams>
        headerTitle="Daftar Posisi"
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 120,
        }}
        request={getShift}
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
      <ShiftForm
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
    </PageContainer>
  );
};

export default ShiftPage;
