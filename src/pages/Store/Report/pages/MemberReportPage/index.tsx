import { downloadUrl, formatRupiah, formatTableParams } from '@/common/utils/utils';
import { FileExcelOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumnType, ProTable } from '@ant-design/pro-components';
import { Button, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import DateRangePicker from '../../components/DateRangePicker';
import { MemberSale } from '../../data/data';
import { ReportRequestProp, getMemberReportDataTable } from '../../data/services';

type Props = {};

const TransactionReportPage = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tableParam, setCurrentParam] = useState<any>();
  // const [datasource, setDatasource] = useState<MemberSale[] | undefined>();
  const { dateRange, storeID } = useModel('Store.Report.useStoreReport');

  const actionRef = useRef<ActionType>();

  const [queryParam, setQueryParam] = useState<ReportRequestProp>({
    store_id: storeID,
    date_range: dateRange.map((date: any) => date?.format('YYYY-MM-DD')),
  });

  const columns: ProColumnType<MemberSale>[] = [
    {
      title: 'No Anggota',
      dataIndex: 'member_no',
    },
    {
      title: 'Nama Anggota',
      dataIndex: 'name',
    },
    {
      title: 'Jumlah Transaksi',
      dataIndex: 'total_transaction',
      search: false,
    },
    {
      title: 'Tunai',
      dataIndex: 'total_cash',
      align: 'right',
      search: false,
      render: (text: any) => {
        return formatRupiah(text);
      },
    },
    {
      title: 'Kredit',
      dataIndex: 'total_credit',
      align: 'right',
      search: false,
      render: (text: any) => {
        return formatRupiah(text);
      },
    },
    {
      title: 'Total Belanja',
      dataIndex: 'total_amount',
      align: 'right',
      search: false,
      render: (text: any) => {
        return formatRupiah(text);
      },
    },
  ];

  useEffect(() => {
    handleGenerateReport();
  }, [dateRange, storeID]);

  const handleGenerateReport = async () => {
    if (dateRange && dateRange.length === 2) {
      const param = {
        store_id: storeID,
        date_range: dateRange.map((date: any) => date?.format('YYYY-MM-DD')),
      };
      setQueryParam(param);
      actionRef.current?.reloadAndRest?.();
      // setLoading(true);
      // // const response = await getMemberReport(queryParams);
      // if (response.success) {
      //     setDatasource(response.data.members);
      // }
      // setLoading(false);
    }
  };

  return (
    <PageContainer
      header={{
        title: 'Laporan Transaksi',
      }}
      extra={<DateRangePicker />}
    >
      <Spin spinning={loading}>
        <ProTable<MemberSale>
          actionRef={actionRef}
          headerTitle={'Pembelian Anggota'}
          columns={columns}
          request={(params: any, options: any) => {
            setCurrentParam(formatTableParams(params));
            return getMemberReportDataTable(params, queryParam, options);
          }}
          search={{
            labelWidth: 150,
          }}
          rowKey={'id'}
          toolBarRender={() => [
            <Button
              type="primary"
              key="1"
              onClick={() => {
                downloadUrl(
                  '/api/web/store/report/member-datatable/export',
                  'pembelian_anggota.xlsx',
                  {
                    ...tableParam,
                    ...queryParam,
                  },
                );
              }}
            >
              <FileExcelOutlined /> Export Excel
            </Button>,
          ]}
        />
      </Spin>
    </PageContainer>
  );
};

export default TransactionReportPage;
