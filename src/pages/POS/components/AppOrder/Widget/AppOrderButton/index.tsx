import { MobileOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

import { getNewAppOrder } from '@/pages/POS/data/service';
import AppOrderDrawer from '../..';
import POSButton from '../../../POSButton';
import './index.less';

const AppOrderButton: React.FC = () => {
  const [countNewOrder, setCountNewOrder] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    checkForNewOrders();
    const intervalId = setInterval(checkForNewOrders, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const checkForNewOrders = () => {
    getNewAppOrder().then((data) => {
      if (data.success) {
        setCountNewOrder(data.data);
        console.log(data);
      }
    });
  };

  return (
    <>
      <POSButton
        onClick={() => setOpenDrawer(true)}
        icon={<MobileOutlined style={{ fontSize: '24px' }} />}
        className={countNewOrder > 0 ? 'blink' : ''}
        title="App Order"
      ></POSButton>
      <AppOrderDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} />
    </>
  );
};

export default AppOrderButton;
