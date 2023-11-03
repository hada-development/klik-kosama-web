import { formatRupiah } from '@/common/utils/utils';
import { ModalForm, ProFormDigit, ProFormInstance } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Table } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { POSItem } from '../data/data';

type Props = {};

const ItemTable = ({}: Props) => {
  const { items, totalAmount, totalItems, changeQuantity } = useModel('POS.usePos');
  const qtyFormRef = useRef<ProFormInstance>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [selectedItem, setSelectedItem] = useState<[number, POSItem] | undefined>();

  useEffect(() => {
    if (qtyFormRef.current) {
      if (selectedItem) {
        qtyFormRef.current.setFieldsValue({
          quantity: selectedItem[1].quantity,
        });
      }
    }
  }, [selectedItem]);

  const columns = [
    {
      title: 'Produk',
      dataIndex: ['product', 'name'],
      width: '50%',
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      width: '10%',
      align: 'center' as 'center',
    },
    {
      title: 'Satuan',
      dataIndex: ['product', 'sell_price'],
      align: 'right' as 'right',
      render: (text: any, _: any) => formatRupiah(text),
    },
    {
      title: 'Sub Total',
      dataIndex: 'subTotal',
      align: 'right' as 'right',
      render: (text: any, _: any) => formatRupiah(text),
    },
  ];

  return (
    <>
      <Table<POSItem>
        rowKey={'product_id'}
        columns={columns}
        bordered={true}
        dataSource={items}
        pagination={false}
        rowClassName={'table-row-pointer'}
        style={{ minHeight: '380px' }}
        scroll={{
          y: '340px',
        }}
        onRow={(record, index) => ({
          onClick: () => {
            setSelectedItem([index!, record]);
            setModalOpen(true);
          },
        })}
      />

      <ModalForm
        formRef={qtyFormRef}
        open={modalOpen}
        width={600}
        title={'Ubah Quantity'}
        onOpenChange={setModalOpen}
        onFinish={async (value: { quantity: number }) => {
          const quantity = value.quantity;
          if (selectedItem) {
            changeQuantity(selectedItem[0], quantity);
            setSelectedItem(undefined);
          }
          return true;
        }}
        submitter={{
          searchConfig: {
            resetText: 'Hapus',
          },
          resetButtonProps: {
            danger: true,
            onClick: () => {
              if (selectedItem) {
                changeQuantity(selectedItem[0], 0);
                setSelectedItem(undefined);
              }
              setModalOpen(false);
            },
          },
        }}
      >
        <div style={{ margin: '12px 0px' }}>
          <span style={{ display: 'block' }}>Produk</span>
          <strong>{selectedItem?.[1].product.name}</strong>
        </div>

        <div style={{ margin: '12px 0px' }}>
          <span style={{ display: 'block' }}>Stok</span>
          <strong>{selectedItem?.[1].product.stock} Item</strong>
        </div>

        <ProFormDigit
          label="Jumlah"
          name={'quantity'}
          min={0}
          max={selectedItem?.[1].product.stock}
          required={true}
          style={{
            fontSize: '24px',
          }}
          rules={[
            {
              required: true,
            },
          ]}
          placeholder={'Masukkan Qty'}
        />
      </ModalForm>
    </>
  );
};

export default ItemTable;
