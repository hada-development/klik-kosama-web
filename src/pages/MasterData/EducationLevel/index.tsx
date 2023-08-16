import { ActionType, FooterToolbar, ModalForm, PageContainer, ProColumns, ProFormText, ProTable } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import { addEducationLevel, deleteEducationLevel, getEducationLevel } from './data/services/service';
import { Button, Modal, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import EducationLevelForm from './components/EducationLevelForm';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRow: EducationLevelFeature.EducationLevelListItem | undefined) => {
  const hide = message.loading('Mohon Tunggu');
  if (!selectedRow) return true;
  try {
    await deleteEducationLevel(selectedRow.id);
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

const EducationLevelPage: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<EducationLevelFeature.EducationLevelListItem | undefined>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, handleDeleteModalOpen] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<EducationLevelFeature.EducationLevelListItem[]>([]);

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<EducationLevelFeature.EducationLevelListItem>[] = [
    {
      title: "Nama Tingkat Pendidikan",
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
      <ProTable<EducationLevelFeature.EducationLevelListItem, API.PageParams>
        headerTitle="Daftar Tingkat Pendidikan"
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 200,
        }}
        request={getEducationLevel}
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
      <EducationLevelForm
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

export default EducationLevelPage;