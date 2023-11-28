import { downloadUrl, formatRupiah, formatTableParams } from '@/common/utils/utils';
import { FileExcelOutlined } from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useRef, useState } from 'react';
import { memberType } from '../../Member/data/data';
import SavingSummaryCard from '../components/Summary';
import { getSavingSummaryTable } from '../data/service';
const SavingSummaryPage: React.FC = () => {
  const [currentParam, setCurrentParam] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<SavingFeature.SavingSummaryMember[]>([]);

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<SavingFeature.SavingSummaryMember>[] = [
    {
      title: 'Nama Anggota',
      dataIndex: 'member_name',
    },
    {
      title: 'No Anggota',
      dataIndex: 'member_no',
    },
    {
      title: 'Jenis Anggota',
      dataIndex: 'member_type',
      valueEnum: memberType,
    },
    {
      title: 'Simpanan Pokok',
      dataIndex: 'principal_saving',
      search: false,
      render: (data: any, record: any) => {
        return formatRupiah(data);
      },
    },
    {
      title: 'Simpanan Wajib',
      dataIndex: 'mandatory_saving',
      search: false,
      render: (data: any, record: any) => {
        return formatRupiah(data);
      },
    },
    {
      title: 'Simpanan Sukarela',
      dataIndex: 'voluntary_saving',
      search: false,
      render: (data: any, record: any) => {
        return formatRupiah(data);
      },
    },
    {
      title: 'Total Simpanan',
      dataIndex: 'total_saving',
      search: false,
      render: (data: any, record: any) => {
        return formatRupiah(data);
      },
    },
    {
      title: 'Total Hutang Barang',
      dataIndex: 'remaining_loan',
      search: false,
      render: (data: any, record: any) => {
        return formatRupiah(data);
      },
    },
  ];

  return (
    <PageContainer>
      <div
        style={{
          marginBottom: '12px',
        }}
      >
        <SavingSummaryCard />
      </div>

      <ProTable<SavingFeature.SavingSummaryMember, API.PageParams>
        headerTitle="Rekap Simpanan Anggota"
        rowKey="member_id"
        actionRef={actionRef}
        search={{
          labelWidth: 120,
        }}
        request={(params) => {
          setCurrentParam(formatTableParams(params));
          return getSavingSummaryTable(params);
        }}
        scroll={{
          x: 'max-content',
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="1"
            onClick={() => {
              downloadUrl('/api/web/coop/saving/summary/export', null, currentParam);
            }}
          >
            <FileExcelOutlined /> Export Excel
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
    </PageContainer>
  );
};

export default SavingSummaryPage;
