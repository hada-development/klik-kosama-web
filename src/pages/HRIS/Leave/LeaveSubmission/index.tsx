import { submissionStatuses } from '@/common/data/data';
import { formatDateTime } from '@/common/utils/utils';
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  OrderedListOutlined,
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
import LeaveSubmissionForm from './components/LeaveSubmissionForm';
import { deleteLeaveSubmission, getLeaveSubmission } from './data/services/service';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (
  selectedRow: LeaveSubmissionFeature.LeaveSubmissionListItem | undefined,
) => {
  const hide = message.loading('Mohon Tunggu');
  if (!selectedRow) return true;
  try {
    await deleteLeaveSubmission(selectedRow.id);
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

const LeaveSubmissionPage: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<
    LeaveSubmissionFeature.LeaveSubmissionListItem | undefined
  >();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, handleDeleteModalOpen] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<
    LeaveSubmissionFeature.LeaveSubmissionListItem[]
  >([]);
  const [{ confirm }, contextHolder] = Modal.useModal();

  const actionRef = useRef<ActionType>();

  const onDelete = (record: LeaveSubmissionFeature.LeaveSubmissionListItem) => {
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

  const columns: ProColumns<LeaveSubmissionFeature.LeaveSubmissionListItem>[] = [
    {
      title: 'Pegawai',
      dataIndex: ['parent_submission', 'employee', 'user', 'name'],
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Jenis Juti',
      dataIndex: ['leave_type', 'name'],
      width: 150,
    },
    {
      title: 'Dari Tanggal',
      dataIndex: 'start_date',
      width: 80,

      render: (_, record) => formatDateTime(record.start_date, 'DD/MM/YYYY'),
    },
    {
      title: 'Sampai Tanggal',
      dataIndex: 'end_date',
      width: 80,
      render: (_, record) => formatDateTime(record.end_date, 'DD/MM/YYYY'),
    },
    {
      title: 'Jumlah Hari',
      width: 80,
      dataIndex: 'total_days',
    },
    {
      title: 'Alasan',
      width: 150,
      dataIndex: 'note',
    },
    {
      title: 'Approval',
      width: 150,
      dataIndex: ['parent_submission', 'current_step', 'title'],
    },
    {
      title: 'Status',
      width: 120,
      dataIndex: ['parent_submission', 'status'],
      valueEnum: submissionStatuses,
    },
    {
      title: 'Aksi',
      dataIndex: 'option',
      width: '12%',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            handleModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <OrderedListOutlined /> Detail
        </a>,
        <a
          key="delete"
          style={{
            color: 'red',
          }}
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
      <ProTable<LeaveSubmissionFeature.LeaveSubmissionListItem, API.PageParams>
        headerTitle="Pengajuan Cuti"
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 120,
        }}
        scroll={{
          x: 'max-content',
        }}
        request={getLeaveSubmission}
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
      <LeaveSubmissionForm
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

export default LeaveSubmissionPage;
