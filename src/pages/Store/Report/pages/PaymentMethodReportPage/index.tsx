import { formatRupiah } from '@/common/utils/utils';
import { mapPaymentMethodName } from '@/pages/POS/data/data';
import { PageContainer, ProColumnType, ProTable } from '@ant-design/pro-components';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import DateRangePicker from '../../components/DateRangePicker';
import { PaymentMethodReport } from '../../data/data';
import { getPaymentMethodReport } from '../../data/services';

type Props = {};

const MemberReportPage = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [datasource, setDatasource] = useState<PaymentMethodReport[] | undefined>();

  const { dateRange, storeID } = useModel('Store.Report.useStoreReport');

  const columns: ProColumnType<PaymentMethodReport>[] = [
    {
      title: 'Metode Pembayaran',
      dataIndex: 'code',
      render: (text: any) => {
        return mapPaymentMethodName(text);
      },
    },
    {
      title: 'Total Penjualan',
      dataIndex: 'total_amount',
      align: 'right',
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
      const queryParams = {
        store_id: storeID,
        date_range: dateRange.map((date: any) => date?.format('YYYY-MM-DD')),
      };

      setLoading(true);
      const response = await getPaymentMethodReport(queryParams);
      if (response.success) {
        setDatasource(response.data);
      }
      setLoading(false);
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
        <ProTable<PaymentMethodReport>
          columns={columns}
          dataSource={datasource}
          search={false}
          headerTitle={'Metode Pembayaran'}
          rowKey={'id'}
        />
      </Spin>
    </PageContainer>
  );
};

export default MemberReportPage;
