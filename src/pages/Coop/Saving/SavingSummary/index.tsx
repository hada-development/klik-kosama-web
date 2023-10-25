import { downloadUrl, formatRupiah, formatTableParams } from '@/common/utils/utils';
import { FileExcelOutlined } from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProTable,
  StatisticCard,
} from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { memberType } from '../../Member/data/data';
import { getCompanySavingSummary, getSavingSummaryTable } from '../data/service';

import savingBlue from '../../../../../assets/saving_blue.png';
import savingBrown from '../../../../../assets/saving_brown.png';
import savingGreen from '../../../../../assets/saving_green.png';
import savingViolet from '../../../../../assets/saving_violet.png';

const imgStyle = {
  display: 'block',
  width: 42,
  height: 42,
};

const statisticCardValueStyle = {
  fontSize: '12pt',
  fontWeight: 'bold',
};

const SavingSummaryPage: React.FC = () => {
  const [currentParam, setCurrentParam] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<SavingFeature.SavingSummaryMember[]>([]);

  const [savingSummary, setSavingSummary] = useState<SavingFeature.SavingSummaryCompany>();

  useEffect(function () {
    getCompanySavingSummary().then((data) => {
      const summary = data.data[0];
      setSavingSummary(summary);
    });
  }, []);

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
        <StatisticCard.Group direction={'row'}>
          <StatisticCard
            statistic={{
              title: 'Total Simpanan',
              value: savingSummary?.total_saving ?? 0,
              formatter: formatRupiah,
              valueStyle: statisticCardValueStyle,
              icon: <img style={imgStyle} src={savingBrown} alt="icon" />,
            }}
          />
          <StatisticCard
            statistic={{
              title: 'Simpanan Pokok',
              value: savingSummary?.principal_saving ?? 0,
              formatter: formatRupiah,
              valueStyle: statisticCardValueStyle,
              icon: <img style={imgStyle} src={savingBlue} alt="icon" />,
            }}
          />
          <StatisticCard
            statistic={{
              title: 'Simpanan Wajib',
              value: savingSummary?.mandatory_saving ?? 0,
              formatter: formatRupiah,
              valueStyle: statisticCardValueStyle,
              icon: <img style={imgStyle} src={savingGreen} alt="icon" />,
            }}
          />
          <StatisticCard
            statistic={{
              title: 'Simpanan Sukarela',
              value: savingSummary?.voluntary_saving ?? 0,
              formatter: formatRupiah,
              valueStyle: statisticCardValueStyle,
              icon: <img style={imgStyle} src={savingViolet} alt="icon" />,
            }}
          />
        </StatisticCard.Group>
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
