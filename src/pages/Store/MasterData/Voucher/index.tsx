import { voucherStatuses } from '@/common/data/data';
import { formatDateTime, formatRupiah } from '@/common/utils/utils';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
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
import BarcodeModal from './components/BarcodeModal';
import VoucherForm from './components/VoucherForm';
import { VoucherFeature } from './data/data';
import { deleteVoucher, getVoucher } from './data/services/service';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRow: VoucherFeature.VoucherListItem | undefined) => {
  const hide = message.loading('Mohon Tunggu');
  if (!selectedRow) return true;
  try {
    await deleteVoucher(selectedRow.id);
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

const VoucherPage: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<VoucherFeature.VoucherListItem | undefined>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, handleDeleteModalOpen] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<VoucherFeature.VoucherListItem[]>([]);
  const [{ confirm }, contextHolder] = Modal.useModal();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBarcode, setSelectedBarcode] = useState('');

  const actionRef = useRef<ActionType>();

  const onDelete = (record: VoucherFeature.VoucherListItem) => {
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
  const showBarcodeModal = (barcode: string) => {
    setModalVisible(true);
    setSelectedBarcode(barcode);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const columns: ProColumns<VoucherFeature.VoucherListItem>[] = [
    {
      title: 'Barcode',
      dataIndex: ['barcode'],
      render: (text: any) => (
        <Button type="link" onClick={() => showBarcodeModal(text)}>
          {text}
        </Button>
      ),
    },
    {
      title: 'Nama Voucher',
      dataIndex: 'name',
    },
    {
      title: 'Nominal Voucher',
      dataIndex: 'amount',
      search: false,
      render: (text: any, _) => {
        return formatRupiah(text);
      },
    },
    {
      title: 'Expired',
      dataIndex: 'expired_at',
      render: (text: any, _) => {
        return formatDateTime(text, 'DD/MM/YYYY');
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      valueEnum: voucherStatuses,
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
      <ProTable<VoucherFeature.VoucherListItem, API.PageParams>
        headerTitle="Daftar Voucher"
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 120,
        }}
        request={getVoucher}
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
      <VoucherForm
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
      <BarcodeModal
        visible={modalVisible}
        onClose={handleModalClose}
        barcodeValue={selectedBarcode}
      />
    </PageContainer>
  );
};

export default VoucherPage;
