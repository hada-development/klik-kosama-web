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
  const { pageLoading, printableTrx, printSuccess, storeId } = useModel('POS.usePos');

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
          <Receipt ref={printRef} transaction={printableTrx} storeID={storeId} />
        </div>
      </Spin>
    </Card>
  );
}
