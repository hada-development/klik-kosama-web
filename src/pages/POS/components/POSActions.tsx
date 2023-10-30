import { shortcutService } from '@/common/services/custom/shortcutService';
import { CloseOutlined, OrderedListOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Card, Divider } from 'antd';
import { useEffect } from 'react';
import MemberPicker from './MemberPicker';
import POSButton from './POSButton';
import PaymentMethod from './PaymentMethod';
import VoucherPicker from './VoucherPicker';

type Props = {};

export default function POSActions({}: Props) {
  const { clearPos, handlePreCheckout } = useModel('POS.usePos');

  const onCheckout = () => {
    handlePreCheckout();
  };

  useEffect(() => {
    // Register shortcut
    shortcutService.registerShortcut('F4', false, () => {
      onCheckout();
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

        <POSButton icon={<OrderedListOutlined style={{ fontSize: '24px' }} />} title="History" />
      </div>

      <Divider dashed style={{ margin: '8px 0px' }} />
      <PaymentMethod />

      <div style={{ display: 'flex', gap: '8px', flex: '0 0 auto' }}>
        <POSButton
          icon={<span style={{ fontSize: '24px', lineHeight: '24px' }}>F4</span>}
          type="primary"
          title="Payment"
          onClick={onCheckout}
        />
      </div>
    </Card>
  );
}
