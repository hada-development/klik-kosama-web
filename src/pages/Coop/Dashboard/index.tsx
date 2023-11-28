import { PageContainer } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React from 'react';
import SavingSummaryCard from '../Saving/components/Summary';
import MarginChart from './components/MarginChart';
import MemberSummaryCard from './components/MemberSummary';

type Props = {};

const CoopDashboardScreen: React.FC = (props: Props) => {
  return (
    <PageContainer>
      <Row>
        <Col span={24} style={{ marginBottom: '12px' }}>
          <MemberSummaryCard />
        </Col>

        <Col span={24}>
          <SavingSummaryCard />
        </Col>

        <Col span={24} style={{ marginTop: '12px' }}>
          <MarginChart />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default CoopDashboardScreen;
