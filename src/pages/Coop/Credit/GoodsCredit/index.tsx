import { formatDateTime, formatRupiah } from '@/common/utils/utils';
import { EyeOutlined, UploadOutlined } from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';
import ExcelImportModal from '../../Shared/Components/ExcelImportModal';
import { CreditStatuses, GoodsCreditListItem } from './data/data';
import { getGoodsCreditListTable } from './data/service';

const GoodsCreditListPage: React.FC = () => {
  const [selectedRowsState, setSelectedRows] = useState<GoodsCreditListItem[]>([]);
  const [importModalOpen, handleImportModalOpen] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();

  function navigateDetail(id: number) {
    history.push(`/coop/credit/goods/${id}`);
  }

  const columns: ProColumns<GoodsCreditListItem>[] = [
    {
      title: 'No. Kredit',
      dataIndex: 'credit_no',
      render: (data, record) => [
        <a
          key="show"
          onClick={() => {
            navigateDetail(record.id);
          }}
        >
          {data}
        </a>,
      ],
    },
    {
      title: 'Anggota',
      dataIndex: 'member_name',
      render: (_, record) => {
        return `${record.user.name} (${record.user.member?.member_no ?? 'NON'})`;
      },
    },
    {
      title: 'Barang / Keperluan',
      dataIndex: 'note',
      width: '250px',
      search: false,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      valueEnum: CreditStatuses,
    },
    {
      title: 'Periode',
      dataIndex: 'installment_term',
      render: (_, record) => {
        return `${record.installment_term} Bulan`;
      },
    },
    {
      title: 'Tanggal Awal Kredit',
      dataIndex: 'handover_date',
      search: false,
      render: (data: any, _) => {
        return formatDateTime(data, 'DD/MMM/YYYY');
      },
    },

    {
      title: 'Tanggal Akhir Kredit',
      dataIndex: 'due_date',
      search: false,
      render: (data: any, _) => {
        return formatDateTime(data, 'DD/MMM/YYYY');
      },
    },

    {
      title: 'Harga Jual',
      dataIndex: 'sell_price',
      search: false,
      render: (data, _) => {
        return formatRupiah(data);
      },
    },
    {
      title: 'Harga Beli',
      dataIndex: 'buy_price',
      search: false,
      render: (data, _) => {
        return formatRupiah(data);
      },
    },
    {
      title: 'Margin',
      dataIndex: 'margin',
      search: false,
      render: (_, record) => {
        return formatRupiah(record.sell_price - record.buy_price);
      },
    },

    {
      title: 'Angsuran / Bulan',
      dataIndex: 'buy_price',
      search: false,
      render: (_, record) => {
        return formatRupiah(Math.round(record.sell_price / record.installment_term));
      },
    },

    {
      title: 'Total Pembayaran',
      dataIndex: 'total_paid',
      search: false,
      render: (_, record) => {
        return formatRupiah(record.total_paid);
      },
    },
    {
      title: 'Sisa Pembayaran Angsuran',
      dataIndex: 'total_paid',
      search: false,
      render: (_, record) => {
        const remaining = record.sell_price - record.total_paid;
        return formatRupiah(Math.round(Math.max(remaining, 0)));
      },
    },

    {
      title: 'Aksi',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="show"
          onClick={() => {
            navigateDetail(record.id);
          }}
        >
          <EyeOutlined /> Lihat
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<GoodsCreditListItem, API.PageParams>
        headerTitle="Daftar Kredit Barang"
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 200,
        }}
        toolbar={{
          actions: [
            <Button onClick={() => handleImportModalOpen(true)}>
              <UploadOutlined />
              Import Pembayaran
            </Button>,
          ],
        }}
        request={getGoodsCreditListTable}
        columns={columns}
        scroll={{
          x: 'max-content',
        }}
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

      <ExcelImportModal
        isModalOpen={importModalOpen}
        setIsModalOpen={handleImportModalOpen}
        url="/api/web/coop/credit/payment/import"
        templateUrl="/api/web/coop/credit/payment/export"
        title="Import Pembayaran"
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

export default GoodsCreditListPage;
