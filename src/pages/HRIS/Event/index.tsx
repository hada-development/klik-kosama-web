import { publishStatuses } from '@/common/data/data';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message } from 'antd';
import React, { useRef, useState } from 'react';
import EventForm from './components/EventForm';
import { deleteEvent, getEvent } from './data/services/service';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRow: EventFeature.EventListItem | undefined) => {
  const hide = message.loading('Mohon Tunggu');
  if (!selectedRow) return true;
  try {
    await deleteEvent(selectedRow.id);
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

const EventPage: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<EventFeature.EventListItem | undefined>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, handleDeleteModalOpen] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<EventFeature.EventListItem[]>([]);
  const [{ confirm }, contextHolder] = Modal.useModal();

  const actionRef = useRef<ActionType>();

  const onDelete = (record: EventFeature.EventListItem) => {
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

  const columns: ProColumns<EventFeature.EventListItem>[] = [
    {
      title: 'Tanggal',
      dataIndex: 'date',
    },
    {
      title: 'Nama Event',
      dataIndex: 'title',
    },
    {
      title: 'Deskripsi',
      dataIndex: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      valueEnum: publishStatuses,
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
      <ProTable<EventFeature.EventListItem, API.PageParams>
        headerTitle="Daftar Event"
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 120,
        }}
        request={getEvent}
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

      <EventForm
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

export default EventPage;
