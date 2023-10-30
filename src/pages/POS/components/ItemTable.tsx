import { formatRupiah } from '@/common/utils/utils';
import { ModalForm, ProFormDigit, ProFormInstance } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Table } from 'antd';
import { useRef, useState } from 'react';
import { POSItem } from '../data/data';

type Props = {};

const ItemTable = ({}: Props) => {
  const { items, totalAmount, totalItems, changeQuantity } = useModel('POS.usePos');
  const qtyFormRef = useRef<ProFormInstance>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

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
            setSelectedIndex(index);
            setModalOpen(true);
            qtyFormRef.current?.setFieldsValue({
              quantity: record.quantity,
            });
          },
        })}
      />

      <ModalForm
        formRef={qtyFormRef}
        open={modalOpen}
        width={300}
        title={'Ubah Quantity'}
        onOpenChange={setModalOpen}
        onFinish={async (value: { quantity: number }) => {
          const quantity = value.quantity;
          changeQuantity(selectedIndex!, quantity);
          setSelectedIndex(undefined);
          return true;
        }}
        submitter={{
          searchConfig: {
            resetText: 'Hapus',
          },
          resetButtonProps: {
            danger: true,
            onClick: () => {
              console.log('Reset');
              changeQuantity(selectedIndex!, 0);
              setSelectedIndex(undefined);
              setModalOpen(false);
            },
          },
        }}
      >
        <ProFormDigit
          label="Jumlah"
          name={'quantity'}
          min={0}
          required={true}
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
