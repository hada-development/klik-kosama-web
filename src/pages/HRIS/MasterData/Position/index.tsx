import { ActionType, FooterToolbar, ModalForm, PageContainer, ProColumns, ProFormText, ProTable } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import { addPosition, deletePosition, getPosition } from './data/services/service';
import { Button, Modal, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import PositionForm from './components/PositionForm';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRow: PositionFeature.PositionListItem | undefined) => {
  const hide = message.loading('Mohon Tunggu');
  if (!selectedRow) return true;
  try {
    await deletePosition(selectedRow.id);
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error: any) {
    hide();
    var errorMessage: string | undefined = error.response?.data?.message;
    if (errorMessage) {
      message.error(errorMessage);
      return false;
    }
    message.error('Delete failed, please try again');
    return false;
  }
};

const PositionPage: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<PositionFeature.PositionListItem | undefined>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, handleDeleteModalOpen] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<PositionFeature.PositionListItem[]>([]);

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<PositionFeature.PositionListItem>[] = [
    {
      title: "Nama Posisi",
      dataIndex: 'name',
      tip: 'The rule name is the unique key',
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
        <a key="delete"
          onClick={() => {
            handleDeleteModalOpen(true);
            setCurrentRow(record);
          }}>
          <DeleteOutlined /> Hapus
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<PositionFeature.PositionListItem, API.PageParams>
        headerTitle="Daftar Posisi"
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 120,
        }}
        request={getPosition}
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
              Dipilih{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              Item
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
      <PositionForm
        onCancel={() => { }}
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
          await handleRemove(currentRow)
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
}

export default PositionPage;