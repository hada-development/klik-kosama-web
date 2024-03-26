import { formatRupiah } from '@/common/utils/utils';
import { useModel } from '@umijs/max';
import { Table } from 'antd';

type Props = {};

export default function SumTable({}: Props) {
  const { totalShopping, totalAmount, totalItems, getTotalVoucher } = useModel('POS.usePos');
  return (
    <Table
      columns={[
        {
          title: 'Description',
          dataIndex: 'description',
          width: '70%',
          align: 'right',
        },
        {
          title: 'Value',
          dataIndex: 'value',
          width: '30%',
          align: 'right',
        },
      ]}
      dataSource={[
        {
          key: 'totalItems',
          description: 'Total Barang',
          value: totalItems,
        },
        {
          key: 'totalShopping',
          description: 'Total Belanja',
          value: formatRupiah(totalShopping),
        },
        {
          key: 'totalDiscount',
          description: 'Total Voucher',
          value: formatRupiah(getTotalVoucher() * -1),
        },
        {
          key: 'totalAmount',
          description: 'Total Bayar',
          value: <h2>{formatRupiah(totalAmount)}</h2>,
        },
      ]}
      showHeader={false}
      size="small"
      pagination={false}
      bordered
    />
  );
}
