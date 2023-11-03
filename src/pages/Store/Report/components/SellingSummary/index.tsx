import { Line, LineConfig } from '@ant-design/plots';
import { StatisticCard } from '@ant-design/pro-components';
import { Card, Col, Row } from 'antd';
import { SellingReport } from '../../data/data';
import SellingSummaryTable from './table';

type Props = {
  SellingSummary?: SellingReport;
};

const SellingSummaryWidget: React.FC<Props> = ({ SellingSummary }) => {
  const lineChartConfig: LineConfig = {
    data: SellingSummary?.days ?? [],
    xField: 'transaction_date',
    yField: 'nett_sales',
    height: 250,
  };

  return (
    <div>
      <Row gutter={24}>
        <Col span={24}>
          <StatisticCard.Group>
            <StatisticCard
              statistic={{
                title: 'Total Penjualan Kotor',
                value: SellingSummary?.summary.bruto_sales,
              }}
            />
            <StatisticCard
              statistic={{
                title: 'Total Harga Pokok',
                value: SellingSummary?.summary.total_cogs,
              }}
            />
            <StatisticCard
              statistic={{
                title: 'Total Penjualan Bersih',
                value: SellingSummary?.summary.nett_sales,
              }}
            />
          </StatisticCard.Group>
        </Col>
        <Col span={24} style={{ marginTop: '12px' }}>
          <Card>
            <Line {...lineChartConfig} />
          </Card>
        </Col>
        <Col span={24} style={{ marginTop: '12px' }}>
          <SellingSummaryTable data={SellingSummary?.days ?? []} />
        </Col>
      </Row>
    </div>
  );
};

export default SellingSummaryWidget;
