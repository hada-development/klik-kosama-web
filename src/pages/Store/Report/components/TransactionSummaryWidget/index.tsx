import { StatisticCard } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { TransactionReport } from '../../data/data';
import TransactionReportTable from './table';

type Props = {
  trxReport?: TransactionReport;
};

const TransactionSummaryWidget: React.FC<Props> = ({ trxReport }) => {
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
    </div>
  );
};

export default TransactionSummaryWidget;
