import {
  DeleteOutlined,
  ExclamationCircleFilled,
  EyeOutlined,
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
import React, { useEffect, useRef, useState } from 'react';
import { deleteAdjustment, fetchPayrollComponent, getAdjustment } from './data/services/service';

import { publishStatuses } from '@/common/data/data';
import { formatDateTime } from '@/common/utils/utils';
import { history, useParams } from 'umi';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRow: AdjustmentFeature.AdjustmentListItem | undefined) => {
  const hide = message.loading('Mohon Tunggu');
  if (!selectedRow) return true;
  try {
    await deleteAdjustment(selectedRow.id);
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

const AdjustmentPage: React.FC = () => {
  const [payrollComponent, setPayrollComponent] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<AdjustmentFeature.AdjustmentListItem[]>([]);
  const [{ confirm }, contextHolder] = Modal.useModal();
  const { adjustmentId } = useParams<{ adjustmentId: string }>();

  const actionRef = useRef<ActionType>();

  useEffect(() => {
    if (adjustmentId) {
      fetchPayrollComponent(parseInt(adjustmentId)).then((response) => {
        setPayrollComponent(response.data);
      });
    }
  }, []);

  const onDelete = (record: AdjustmentFeature.AdjustmentListItem) => {
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

  const columns: ProColumns<AdjustmentFeature.AdjustmentListItem>[] = [
    {
      title: 'Judul',
      dataIndex: 'title',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      valueEnum: publishStatuses,
    },
    {
      title: 'Tanggal Efektif',
      dataIndex: 'effective_date',
      render: (_, record: any) => {
        return formatDateTime(record.effective_date, 'DD/MM/YYYY');
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
            history.push('/hris/payroll/adjustment/' + record.id);
          }}
        >
          <EyeOutlined /> Lihat
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
      <ProTable<AdjustmentFeature.AdjustmentListItem, any>
        headerTitle="Daftar Komponen Gaji"
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 120,
        }}
        params={{ payroll_component_id: adjustmentId }}
        request={getAdjustment}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        toolBarRender={() => [
          payrollComponent && (
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                history.push(
                  `/hris/payroll/adjustment/create/${payrollComponent.type}`,
                  payrollComponent,
                );
              }}
            >
              <PlusOutlined /> Buat Adjustmen
            </Button>
          ),
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
    </PageContainer>
  );
};

export default AdjustmentPage;
