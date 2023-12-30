import { downloadUrl, formatRupiah } from '@/common/utils/utils';
import ExcelImportModal from '@/pages/Coop/Shared/Components/ExcelImportModal';
import { EyeOutlined, FileExcelOutlined, UploadOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Tag, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import StoreSelection from '../components/StoreSelection';
import { StockHistory } from './components/StockHistory';
import { StockTableItem, stockStatuses } from './data/data';
import { getStockDataTable } from './data/services';

// import UserForm from './components/UserForm';
// import { deleteUser, getUser } from './data/services/service';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRow: StockTableItem | undefined) => {};

const InformationPage: React.FC = () => {
  const { storeID } = useModel('Store.useStore');
  const [currentRow, setCurrentRow] = useState<StockTableItem | undefined>();
  const [importModalOpen, handleImportModalOpen] = useState<boolean>(false);
  const [detailModalOpen, handleDetailModalOpen] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<StockTableItem[]>([]);

  const actionRef = useRef<ActionType>();

  useEffect(() => {
    actionRef.current?.reloadAndRest?.();
  }, [storeID]);

  const columns: ProColumns<StockTableItem>[] = [
    {
      title: 'SKU',
      width: '200px',
      dataIndex: 'sku',
    },
    {
      title: 'Nama Produk',
      width: '250px',
      dataIndex: 'name',
      ellipsis: false,
    },

    {
      title: 'Barcode',
      dataIndex: 'barcodes',
      search: false,
      width: '200px',
      render: (_, { barcodes }) => (
        <>
          {barcodes.map((tag) => {
            let color = 'geekblue';
            return (
              <Tag color={color} key={tag.value}>
                {tag.value.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },

    {
      title: 'Stok',
      dataIndex: 'quantity',
      width: '100px',
      search: false,
    },

    {
      title: 'Stok Minimun',
      width: '100px',
      search: false,
      dataIndex: 'restock_level',
    },

    {
      title: 'Status',
      width: '100px',
      dataIndex: 'stock_status',
      valueEnum: stockStatuses,
    },

    {
      title: 'Harga Pokok',
      width: '100px',
      search: false,
      dataIndex: 'buy_price',

      render: (data, _) => {
        return formatRupiah(data);
      },
    },

    {
      title: 'Harga Jual',
      width: '100px',
      search: false,
      dataIndex: 'sell_price',
      render: (data, _) => {
        return formatRupiah(data);
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
    <PageContainer extra={<StoreSelection />}>
      <ProTable<StockTableItem, API.PageParams>
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
            key="1"
            onClick={() => {
              downloadUrl('/api/web/store/stock/export?store_id=' + storeID, 'laporan_stock.xlsx');
            }}
          >
            <FileExcelOutlined /> Export Laporan
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
        request={(params, options) => getStockDataTable(storeID, params, options)}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      <StockHistory
        open={detailModalOpen}
        setOpen={(status) => {
          if (status) {
            actionRef.current?.reloadAndRest?.();
          }
          handleDetailModalOpen(false);
        }}
        stock={currentRow}
      />

      <ExcelImportModal
        isModalOpen={importModalOpen}
        setIsModalOpen={handleImportModalOpen}
        url="/api/web/store/stock/import"
        param={{
          store_id: storeID,
        }}
        templateUrl={'/api/web/store/stock/import?store_id=' + storeID}
        onUploaded={() => {
          message.success('Berhasil mengimport transaksi simpanan');
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }}
      />
    </PageContainer>
  );
};

export default InformationPage;
