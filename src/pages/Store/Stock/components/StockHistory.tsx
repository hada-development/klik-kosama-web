import { formatDateTime } from '@/common/utils/utils';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer } from 'antd';
import { message } from 'antd/lib';
import { useEffect, useRef, useState } from 'react';
import { StockHistoryItem, StockTableItem, stockStatuses } from '../data/data';
import { getStockHistoryDataTable } from '../data/services';
import StockForm from './StockForm';

export interface IStockHistoryProps {
  open: boolean;
  setOpen: (flag: boolean) => void;
  stock?: StockTableItem;
}

const descriptionColumns: ProDescriptionsItemProps[] = [
  {
    label: 'Nama Produk',
    dataIndex: 'name',
  },
  {
    label: 'SKU',
    dataIndex: 'sku',
  },
  {
    title: 'Stok',
    dataIndex: 'quantity',
  },
  {
    title: 'Status',
    dataIndex: 'stock_status',
    valueEnum: stockStatuses,
  },
];

const tableColumn: ProColumns<StockHistoryItem>[] = [
  {
    title: 'Tanggal',
    dataIndex: 'created_at',
    render: (data: any, _) => {
      return formatDateTime(data, 'YYYY-MM-DD');
    },
  },
  {
    title: 'Jenis',
    width: '80px',
    dataIndex: 'type',
  },
  {
    title: 'Jumlah',
    dataIndex: 'quantity',
    width: '100px',
    align: 'center',
  },
  {
    title: 'Saldo Stok',
    width: '100px',
    dataIndex: 'balance',
    align: 'center',
  },

  {
    title: 'Keterangan',
    dataIndex: 'notes',
    width: '220px',
    ellipsis: true,
  },

  {
    title: 'User',
    dataIndex: ['user', 'name'],
    width: '120px',
    ellipsis: true,
  },
];

export function StockHistory(props: IStockHistoryProps) {
  const actionRef = useRef<ActionType>();

  const [anyChange, setAnyChange] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);

  useEffect(() => {
    setAnyChange(false);
    actionRef.current?.reloadAndRest?.();
  }, [props.open]);

  return (
    <Drawer
      style={{
        padding: '0px',
      }}
      bodyStyle={{
        padding: '0px',
      }}
      width={800}
      open={props.open}
      onClose={() => props.setOpen(anyChange)}
      title="Stock History"
    >
      <ProDescriptions
        column={2}
        dataSource={props.stock}
        columns={descriptionColumns}
        style={{
          padding: '12px 24px',
        }}
      ></ProDescriptions>
      <Divider
        dashed={true}
        style={{
          margin: '12px 0px',
        }}
      />

      {props.stock && (
        <ProTable
          rowKey={'id'}
          style={{
            padding: '12px',
          }}
          actionRef={actionRef}
          headerTitle="Mutasi Stok"
          search={false}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setOpenEdit(true);
              }}
            >
              <PlusOutlined /> Tambah
            </Button>,
          ]}
          request={(params, options) =>
            getStockHistoryDataTable(props.stock!.stock_id, params, options)
          }
          columns={tableColumn}
        />
      )}

      {props.stock && (
        <StockForm
          visible={openEdit}
          onClose={setOpenEdit}
          StockId={props.stock!.stock_id}
          onSubmit={async (flag: boolean) => {
            actionRef.current?.reloadAndRest?.();
            setAnyChange(true);
            message.success('Berhasil mengupdate data');
            return true;
          }}
        />
      )}
    </Drawer>
  );
}
