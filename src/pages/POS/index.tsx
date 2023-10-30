import { Card, Col, Row } from 'antd';

import ItemTable from './components/ItemTable';
import POSActions from './components/POSActions';
import PaymentModalCash from './components/PaymentModalCash';
import SearchBox from './components/SearchBox';
import SumTable from './components/SumTable';
import './index.less';

export interface IPosPageProps {}

export default function PosPage(props: IPosPageProps) {
  // React.useEffect(() => {
  //   const handleBeforeUnload = (event: any) => {
  //     event.preventDefault();
  //     event.returnValue = 'You have unsaved changes. Are you sure you want to leave this page?';
  //     return event.returnValue;
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  return (
    <Card>
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

      <PaymentModalCash />
    </Card>
  );
}
