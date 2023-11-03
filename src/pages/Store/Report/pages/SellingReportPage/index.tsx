import { PageContainer } from '@ant-design/pro-components';
import { Spin } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import DateRangePicker from '../../components/DateRangePicker';
import SellingSummaryWidget from '../../components/SellingSummary';
import { SellingReport } from '../../data/data';
import { getSellingSummary } from '../../data/services';

type Props = {};

const SellingReportPage = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [SellingReport, setSellingSummary] = useState<SellingReport | undefined>();

  const currentMonth = moment();
  const currentMonthRange = [currentMonth.startOf('month'), currentMonth.endOf('month')];

  const { dateRange, storeID } = useModel('Store.Report.useStoreReport');

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
      const response = await getSellingSummary(queryParams);
      if (response.success) {
        setSellingSummary(response.data);
      }
      setLoading(false);
    }
  };

  return (
    <PageContainer
      header={{
        title: 'Laporan Penjualan',
      }}
      extra={<DateRangePicker />}
    >
      <Spin spinning={loading}>
        <SellingSummaryWidget SellingSummary={SellingReport} />
      </Spin>
    </PageContainer>
  );
};

export default SellingReportPage;
