import { Card, Col, Row, Spin } from 'antd';

import { useCallback, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useModel } from 'umi';
import CheckoutModal from './components/CheckoutModal';
import ItemTable from './components/ItemTable';
import POSActions from './components/POSActions';
import Receipt from './components/Receipt';
import SearchBox from './components/SearchBox';
import SumTable from './components/SumTable';
import TransactionHistory from './components/TransactionHistory';
import './index.less';

export interface IPosPageProps {}

export default function PosPage(props: IPosPageProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const { pageLoading, printableTrx, printSuccess } = useModel('POS.usePos');

  const reactToPrintContent = useCallback(() => {
    return printRef.current;
  }, [printRef.current]);

  useEffect(() => {
    if (printableTrx) {
      handlePrint();
      printSuccess();
    }
  }, [printableTrx]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
  });

  return (
    <Card>
      <Spin spinning={pageLoading}>
        <SearchBox />
        <Row style={{ marginTop: '12px' }}>
          <Col span={16}>
            <ItemTable />
            <SumTable />
          </Col>
          <Col span={8}>
            <POSActions />
          </Col>
        </Row>

        <CheckoutModal />

        <TransactionHistory />

        <div style={{ height: 0, overflow: 'hidden' }}>
          <Receipt ref={printRef} transaction={printableTrx} />
        </div>
      </Spin>
    </Card>
  );
}
