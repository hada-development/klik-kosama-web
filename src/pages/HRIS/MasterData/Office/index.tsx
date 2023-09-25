import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Modal, message } from 'antd';
import React, { useRef, useState } from 'react';
import OfficeForm from './components/OfficeForm';
import { deleteOffice, getOffice } from './data/services/service';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRow: OfficeFeature.OfficeListItem | undefined) => {
  const hide = message.loading('Mohon Tunggu');
  if (!selectedRow) return true;
  try {
    await deleteOffice(selectedRow.id);
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

const OfficePage: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<OfficeFeature.OfficeListItem | undefined>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, handleDeleteModalOpen] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<OfficeFeature.OfficeListItem[]>([]);

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<OfficeFeature.OfficeListItem>[] = [
    {
      title: 'Nama Lokasi kantor',
      dataIndex: 'name',
      tip: 'The rule name is the unique key',
    },
    {
      title: 'Alamat',
      dataIndex: 'address',
      render: (_, record) => {
        if (record.address && record.address?.length > 30) {
          return record.address.substring(0, 30) + '...';
        }
        return record.address;
      },
    },
    {
      title: 'Koordinat',
      dataIndex: 'location',
      valueType: 'option',
      render: (_, record) => {
        return `${record.latitude}, ${record.longitude}`;
      },
    },
    {
      title: 'Radius Max.',
      dataIndex: 'radius',
      valueType: 'option',
      render: (_, record) => {
        return record.radius && parseFloat(record.radius).toFixed(0) + 'M';
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
            handleDeleteModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <DeleteOutlined /> Hapus
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<OfficeFeature.OfficeListItem, API.PageParams>
        headerTitle="Daftar Lokasi kantor"
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 180,
        }}
        request={getOffice}
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
      <OfficeForm
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

      <Modal
        title="Confirm Delete"
        open={deleteModalOpen}
        onCancel={() => handleDeleteModalOpen(false)}
        onOk={async () => {
          await handleRemove(currentRow);
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
};

export default OfficePage;
