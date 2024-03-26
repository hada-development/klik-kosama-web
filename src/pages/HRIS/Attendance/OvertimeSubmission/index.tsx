import { submissionStatuses } from '@/common/data/data';
import { convertToHourMinute } from '@/common/utils/utils';
import { DeleteOutlined, ExclamationCircleFilled, OrderedListOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Modal, message } from 'antd';
import moment from 'moment';
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

const convetDateToDayName = function (date: string): string {
  let dateObj = moment(date);
  return dateObj.format('dddd');
};

const OvertimeSubmissionPage: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<
    OvertimeSubmissionFeature.OvertimeSubmissionListItem | undefined
  >();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
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
      title: 'NIP',
      dataIndex: ['parent_submission', 'employee', 'nip'],
      search: {
        transform: (value) => ({
          'hr_employees.nip': value,
        }),
      },
      width: 100,
    },
    {
      title: 'Nama Pegawai',
      dataIndex: ['parent_submission', 'employee', 'user', 'name'],
      search: {
        transform: (value) => ({
          'users.name': value,
        }),
      },
      width: 200,
    },
    {
      title: 'Hari',
      dataIndex: 'day',
      search: false,

      render: (data, record) => convetDateToDayName(record.date),
      width: 100,
    },
    {
      title: 'Tanggal',
      dataIndex: 'date',
      valueType: 'date',
      width: 100,
    },
    {
      title: 'Dari',
      dataIndex: 'start_time',
      search: false,
      width: 100,
    },
    {
      title: 'Sampai',
      dataIndex: 'end_time',
      search: false,
      width: 100,
    },
    {
      title: 'Waktu',
      dataIndex: 'minutes',
      search: false,
      width: 120,
      render: (data) => {
        return convertToHourMinute(data as number);
      },
    },
    {
      title: 'Catatan',
      dataIndex: 'note',
      search: false,
      width: 200,
    },
    {
      title: 'Approval',
      dataIndex: ['parent_submission', 'current_step', 'title'],
      search: false,
    },
    {
      title: 'Status',
      dataIndex: ['parent_submission', 'status'],
      valueEnum: submissionStatuses,
      search: {
        transform: (value) => ({
          'hr_submissions.status': value,
        }),
      },
    },

    {
      title: 'Aksi',
      dataIndex: 'option',
      search: false,
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
          style={{ color: 'red' }}
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
      <ProTable<OvertimeSubmissionFeature.OvertimeSubmissionListItem, API.PageParams>
        headerTitle="Pengajuan Lembur"
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 120,
        }}
        scroll={{ x: 'max-content' }}
        request={getOvertimeSubmission}
        columns={columns}
      />
      <OvertimeSubmissionForm
        onCancel={() => {}}
        onSubmit={async () => {
          if (actionRef.current) {
            actionRef.current.reload();
          }
          message.success('Berhasil mengupdate data');
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
