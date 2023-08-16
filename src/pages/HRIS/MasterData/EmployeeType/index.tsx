import { ActionType, FooterToolbar, ModalForm, PageContainer, ProColumns, ProFormText, ProTable } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import { addEmployeeType, deleteEmployeeType, getEmployeeType } from './data/services/service';
import { Button, Modal, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import EmployeeTypeForm from './components/EmployeeTypeForm';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRow: EmployeeTypeFeature.EmployeeTypeListItem | undefined) => {
  const hide = message.loading('Mohon Tunggu');
  if (!selectedRow) return true;
  try {
    await deleteEmployeeType(selectedRow.id);
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

const EmployeeTypePage: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<EmployeeTypeFeature.EmployeeTypeListItem | undefined>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, handleDeleteModalOpen] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<EmployeeTypeFeature.EmployeeTypeListItem[]>([]);

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<EmployeeTypeFeature.EmployeeTypeListItem>[] = [
    {
      title: "Nama Jenis Pegawai",
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
      <ProTable<EmployeeTypeFeature.EmployeeTypeListItem, API.PageParams>
        headerTitle="Daftar Jenis Pegawai"
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 200,
        }}
        request={getEmployeeType}
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
      <EmployeeTypeForm
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

export default EmployeeTypePage;