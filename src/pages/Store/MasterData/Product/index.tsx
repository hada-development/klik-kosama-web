import { formatRupiah } from '@/common/utils/utils';
import { CheckCircleFilled, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Tag, message } from 'antd';
import React, { useRef, useState } from 'react';
import ProductForm from './components/ProductForm';
import { ProductTableItem } from './data/data';
import { getProductDataTable } from './data/services';

// import UserForm from './components/UserForm';
// import { deleteUser, getUser } from './data/services/service';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRow: ProductTableItem | undefined) => {};

const InformationPage: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<ProductTableItem | undefined>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, handleDeleteModalOpen] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<ProductTableItem[]>([]);

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<ProductTableItem>[] = [
    {
      title: 'SKU',
      dataIndex: 'sku',
    },
    {
      title: 'Nama Produk',
      dataIndex: 'name',
    },

    {
      title: 'Barcode',
      dataIndex: 'barcodes',
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
      title: 'Harga Pokok',
      dataIndex: 'buy_price',

      render: (data, _) => {
        return formatRupiah(data);
      },
    },

    {
      title: 'Harga Jual',
      dataIndex: 'sell_price',
      render: (data, _) => {
        return formatRupiah(data);
      },
    },
    {
      title: 'Kategori',
      dataIndex: ['category', 'name'],
    },

    {
      title: 'POS',
      dataIndex: ['availability', 'in_pos'],
      render: (data, _) => {
        if (data == true) {
          return <CheckCircleFilled />;
        }
        return '-';
      },
    },

    {
      title: 'APP',
      dataIndex: ['availability', 'in_app'],
      render: (data, _) => {
        if (data == true) {
          return <CheckCircleFilled />;
        }
        return '-';
      },
    },

    {
      title: 'Aksi',
      dataIndex: 'option',
      width: '8%',
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
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<ProductTableItem, API.PageParams>
        headerTitle="Daftar Produk"
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 200,
        }}
        request={getProductDataTable}
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

      <ProductForm
        visible={createModalOpen}
        onClose={handleModalOpen}
        productId={currentRow?.id}
        onSubmit={async (a) => {
          message.success('Berhasil mengupdate data');
          actionRef.current?.reloadAndRest?.();
          return true;
        }}
      />
    </PageContainer>
  );
};

export default InformationPage;
