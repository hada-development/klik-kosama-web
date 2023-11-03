import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import DateRangePicker from '../../components/DateRangePicker';
import TransactionSummaryWidget from '../../components/TransactionSummaryWidget';
import { TransactionReport } from '../../data/data';
import { getTransactionSummary } from '../../data/services';

type Props = {};

const TransactionReportPage = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [transactionReport, setTransactionReport] = useState<TransactionReport | undefined>();
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
      const response = await getTransactionSummary(queryParams);
      if (response.success) {
        setTransactionReport(response.data);
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
        <TransactionSummaryWidget trxReport={transactionReport} />
      </Spin>
    </PageContainer>
  );
};

export default TransactionReportPage;
