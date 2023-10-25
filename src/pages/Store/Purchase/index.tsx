import { publishStatuses } from '@/common/data/data';
import { formatDateTime } from '@/common/utils/utils';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useRef, useState } from 'react';
import EditableTable from './components/EditableTable';
import { PurchaseTableItem } from './data/data';
import { getPurchaseDataTable } from './data/services';

const PurchaseTable: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<PurchaseTableItem | undefined>();
  const [importModalOpen, handleImportModalOpen] = useState<boolean>(false);
  const [detailModalOpen, handleDetailModalOpen] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<PurchaseTableItem[]>([]);

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<PurchaseTableItem>[] = [
    {
      title: 'Id',
      dataIndex: 'id',
    },

    {
      title: 'Status',

      dataIndex: 'status',
      valueEnum: publishStatuses,
    },

    {
      title: 'Tanggal',
      dataIndex: 'created_at',
      render: (data: any) => {
        return formatDateTime(data, 'DD-MM-YYYY');
      },
    },

    {
      title: 'Aksi',
      dataIndex: 'option',
      width: '8%',
      search: false,
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            handleDetailModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <EyeOutlined /> Detail
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<PurchaseTableItem, API.PageParams>
        scroll={{
          x: 'max-content',
        }}
        headerTitle="Daftar Stok"
        rowKey="id"
        actionRef={actionRef}
        search={{
          collapsed: false,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleImportModalOpen(true);
            }}
          >
            <PlusOutlined /> Tambah
          </Button>,
        ]}
        request={getPurchaseDataTable}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      <EditableTable />
    </PageContainer>
  );
};

export default PurchaseTable;
