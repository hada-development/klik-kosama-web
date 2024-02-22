import Receipt from '@/pages/POS/components/Receipt';
import { useModel } from '@@/exports';
import { StatisticCard } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { useCallback, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { TransactionReport } from '../../data/data';
import TransactionReportTable from './table';

type Props = {
  trxReport?: TransactionReport;
};

const TransactionSummaryWidget: React.FC<Props> = ({ trxReport }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const { printableTrx, printSuccess, storeId } = useModel('POS.usePos');

  const reactToPrintContent = useCallback(() => {
    return printRef.current;
  }, [printRef.current]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
  });

  useEffect(() => {
    if (printableTrx) {
      handlePrint();
      printSuccess();
    }
  }, [printableTrx]);

  return (
    <div>
      <Row gutter={24}>
        <Col span={24}>
          <StatisticCard.Group>
            <StatisticCard
              statistic={{
                title: 'Total Transaksi',
                value: trxReport?.summary.total_transaction,
              }}
            />
            <StatisticCard
              statistic={{
                title: 'Total Transaksi Penjualan',
                value: trxReport?.summary.total_sale,
              }}
            />
            <StatisticCard
              statistic={{
                title: 'Total Transaksi Void',
                value: trxReport?.summary.total_void,
              }}
            />
          </StatisticCard.Group>
        </Col>
        <Col span={24} style={{ marginTop: '12px' }}>
          <TransactionReportTable data={trxReport?.transactions ?? []} />
        </Col>
      </Row>
      <div style={{ height: 0, overflow: 'hidden' }}>
        <Receipt ref={printRef} transaction={printableTrx} storeID={storeId} />
      </div>
    </div>
  );
};

export default TransactionSummaryWidget;
