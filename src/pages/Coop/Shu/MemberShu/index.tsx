import { formatRupiah } from '@/common/utils/utils';
import ExcelImportModal from '@/pages/Coop/Shared/Components/ExcelImportModal';
import { MemberShu } from '@/pages/Coop/Shu/MemberShu/data/data';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
  UploadOutlined,
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
import MemberShuForm from './components/MemberShuForm';
import { deleteMemberShu, getMemberShu } from './data/services/service';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRow: MemberShu | undefined) => {
  const hide = message.loading('Mohon Tunggu');
  if (!selectedRow) return true;
  try {
    await deleteMemberShu(selectedRow.id);
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

const MemberShuPage: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<MemberShu | undefined>();
  const [importModalOpen, handleImportModalOpen] = useState<boolean>(false);
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<MemberShu[]>([]);
  const [{ confirm }, contextHolder] = Modal.useModal();

  const actionRef = useRef<ActionType>();

  const onDelete = (record: MemberShu) => {
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

  const columns: ProColumns<MemberShu>[] = [
    {
      title: 'Tahun',
      dataIndex: 'year',
    },
    {
      title: 'No. Anggota',
      dataIndex: ['member', 'member_no'],
    },
    {
      title: 'Nama Anggota',
      dataIndex: ['member', 'name'],
    },
    {
      title: 'Total SHU',
      dataIndex: 'total_shu',

      search: false,
      render: (data) => {
        return formatRupiah(data);
      },
    },

    {
      title: 'Uang Kehadiran',
      dataIndex: 'attendance_fee',

      search: false,
      render: (data) => {
        return formatRupiah(data);
      },
    },

    {
      title: 'SHU Dibagikan',
      dataIndex: 'paid_shu',

      search: false,
      render: (data) => {
        return formatRupiah(data);
      },
    },

    {
      title: 'SHU Disimpan',
      dataIndex: 'saved_shu',

      search: false,
      render: (data) => {
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
      <ProTable<MemberShu, API.PageParams>
        headerTitle="Daftar SHU Anggota"
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 120,
        }}
        request={getMemberShu}
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
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleImportModalOpen(true);
            }}
          >
            <UploadOutlined /> Import
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
      <MemberShuForm
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

      <ExcelImportModal
        isModalOpen={importModalOpen}
        setIsModalOpen={handleImportModalOpen}
        url="/api/web/coop/shu/import"
        templateUrl={'/api/web/coop/shu/import'}
        onUploaded={() => {
          message.success('Berhasil mengimport SHU');
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }}
      />
    </PageContainer>
  );
};

export default MemberShuPage;
