import { shortcutService } from '@/common/services/custom/shortcutService';
import { CloseOutlined, OrderedListOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Card, Divider, Flex, Typography } from 'antd';
import { useEffect, useRef } from 'react';
import AppOrderButton from './AppOrder/Widget/AppOrderButton';
import MemberPicker from './MemberPicker';
import POSButton from './POSButton';
import PaymentMethod from './PaymentMethod';
import VoucherPicker from './VoucherPicker';

const { Text } = Typography;

type Props = {};

export default function POSActions({}: Props) {
  const { clearPos, handlePreCheckout, setOpenTrxDrawer, appOrder } = useModel('POS.usePos');

  const checkoutButtonRef = useRef<HTMLElement>(null);

  const onCheckout = () => {
    console.log('CLICKED');
    handlePreCheckout();
  };

  useEffect(() => {
    // Register shortcut
    shortcutService.registerShortcut('F4', false, () => {
      if (checkoutButtonRef.current) {
        checkoutButtonRef.current.click();
      }
    });
    return () => {
      // Clean up shortcuts when the component unmounts
      shortcutService.unregisterShortcut('F4', false); // Optionally unregister shortcuts
    };
  }, []);

  return (
    <Card
      style={{ height: '100%' }}
      bodyStyle={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: '8px',
        padding: '0 8px',
      }}
    >
      <div
        style={{
          flex: '0 0 auto',
          flexGrow: '1',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {appOrder && (
          <Flex
            style={{
              background: '#ffd666',
              padding: '10px 20px',
              borderRadius: '4px',
            }}
            justify="space-between"
            align="center"
          >
            <Text strong>Order Via Aplikasi: {appOrder?.order_no}</Text>
            <Button onClick={clearPos} danger type="primary" size="small">
              <CloseOutlined />
            </Button>
          </Flex>
        )}
        <MemberPicker />
        <VoucherPicker />
      </div>

      <div style={{ display: 'flex', gap: '8px', flex: '0 0 auto' }}>
        <POSButton
          onClick={clearPos}
          icon={<CloseOutlined style={{ fontSize: '24px' }} />}
          title="Batalkan"
          type="dashed"
          danger
        />

        <POSButton
          icon={<OrderedListOutlined style={{ fontSize: '24px' }} />}
          title="History"
          onClick={() => setOpenTrxDrawer(true)}
        />

        <AppOrderButton />
      </div>

      <Divider dashed style={{ margin: '8px 0px' }} />
      <PaymentMethod />

      <div style={{ display: 'flex', gap: '8px', flex: '0 0 auto' }}>
        <POSButton
          ref={checkoutButtonRef}
          icon={<span style={{ fontSize: '24px', lineHeight: '24px' }}>F4</span>}
          type="primary"
          title="Payment"
          onClick={onCheckout}
        />
      </div>
    </Card>
  );
}
