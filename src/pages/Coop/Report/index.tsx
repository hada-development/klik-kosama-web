import { ReportModel } from '@/pages/Coop/Report/data/data';
import { deleteReport, getReportDataTable } from '@/pages/Coop/Report/data/services';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';

import { publishStatuses } from '@/common/data/data';
import ReportForm from '@/pages/Coop/Report/component/ReportForm';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  FilePdfOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, message } from 'antd';
import confirm from 'antd/es/modal/confirm';
import React, { useRef, useState } from 'react';

const handleRemove = async (selectedRow: ReportModel | undefined) => {
  const hide = message.loading('Mohon Tunggu');
  if (!selectedRow) return true;
  try {
    await deleteReport(selectedRow.id);
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

const ReportPage: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<ReportModel | undefined>();

  const actionRef = useRef<ActionType>();

  const onDelete = (record: ReportModel) => {
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

  const columns: ProColumns<ReportModel>[] = [
    {
      title: 'Judul',
      dataIndex: 'title',
    },
    {
      title: 'Tahun',
      dataIndex: 'year',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      valueEnum: publishStatuses,
    },
    {
      title: 'File',
      dataIndex: 'file',
      width: '15%',
      search: false,
      render: (_, record) => [
        <a key="edit" href={record.file.address} target="_blank" rel="noreferrer">
          <FilePdfOutlined /> Lihat
        </a>,
      ],
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
    <PageContainer title={'Laporan Keuangan'}>
      <ProTable<ReportModel, API.PageParams>
        headerTitle={'Daftar Laporan Keuangan'}
        actionRef={actionRef}
        rowKey={'id'}
        search={{
          labelWidth: 120,
        }}
        request={getReportDataTable}
        columns={columns}
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
      ></ProTable>

      <ReportForm
        open={createModalOpen}
        setOpen={handleModalOpen}
        values={currentRow}
        onSubmit={async () => {
          message.success('Berhasil mengupdate data');
          setTimeout(() => {
            window.location.reload();
          }, 1500);
          actionRef.current?.reloadAndRest?.();
          return true;
        }}
        onCancel={() => {}}
      />
    </PageContainer>
  );
};

export default ReportPage;
