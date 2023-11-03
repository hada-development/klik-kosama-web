import { submissionStatuses } from '@/common/data/data';
import { EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Modal, message } from 'antd';
import React, { useRef, useState } from 'react';
import OvertimeSubmissionForm from './components/OvertimeSubmissionForm';
import { deleteOvertimeSubmission, getOvertimeSubmission } from './data/services/service';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (
  selectedRow: OvertimeSubmissionFeature.OvertimeSubmissionListItem | undefined,
) => {
  const hide = message.loading('Mohon Tunggu');
  if (!selectedRow) return true;
  try {
    await deleteOvertimeSubmission(selectedRow.id);
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

const OvertimeSubmissionPage: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<
    OvertimeSubmissionFeature.OvertimeSubmissionListItem | undefined
  >();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, handleDeleteModalOpen] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<
    OvertimeSubmissionFeature.OvertimeSubmissionListItem[]
  >([]);
  const [{ confirm }, contextHolder] = Modal.useModal();

  const actionRef = useRef<ActionType>();

  const onDelete = (record: OvertimeSubmissionFeature.OvertimeSubmissionListItem) => {
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

  const columns: ProColumns<OvertimeSubmissionFeature.OvertimeSubmissionListItem>[] = [
    {
      title: 'Pegawai',
      dataIndex: ['parent_submission', 'employee', 'user', 'name'],
    },
    {
      title: 'Tanggal',
      dataIndex: 'date',
    },
    {
      title: 'Dari',
      dataIndex: 'start_time',
    },
    {
      title: 'Sampai',
      dataIndex: 'end_time',
    },
    {
      title: 'Menit',
      dataIndex: 'minutes',
    },
    {
      title: 'Catatan',
      dataIndex: 'note',
    },
    {
      title: 'Status',
      dataIndex: ['parent_submission', 'status'],
      valueEnum: submissionStatuses,
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
          <EditOutlined /> Update
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      {contextHolder}
      <ProTable<OvertimeSubmissionFeature.OvertimeSubmissionListItem, API.PageParams>
        headerTitle="Pengajuan Lembur"
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 120,
        }}
        request={getOvertimeSubmission}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      <OvertimeSubmissionForm
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

export default OvertimeSubmissionPage;
