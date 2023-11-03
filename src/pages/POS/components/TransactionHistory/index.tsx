import { formatDateTime, formatRupiah, isoDateFormat } from '@/common/utils/utils';
import {
  ClockCircleOutlined,
  OrderedListOutlined,
  PrinterOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Drawer, Flex, List, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { POSTransaction, mapPaymentMethodName } from '../../data/data';
import { getTodayTransaction } from '../../data/service';
import TransactionDetail from './detail';

type Props = {};

const slashedTextStyle: React.CSSProperties = {
  position: 'relative',
};

const slashLineStyle: React.CSSProperties = {
  content: '""',
  position: 'absolute',
  top: '50%',
  left: 0,
  width: '100%',
  borderBottom: '2px solid red', // Adjust the color and thickness as needed
};

const TransactionHistory: React.FC<Props> = () => {
  const { openTrxDrawer, setOpenTrxDrawer, printTrx } = useModel('POS.usePos');

  const [loading, setLoading] = useState<boolean>(false);
  const [trx, setTrx] = useState<POSTransaction[]>([]);

  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [selectedTrx, setSelectedTrx] = useState<POSTransaction | undefined>(undefined);

  const openDetailDrawer = (trx: POSTransaction) => {
    setSelectedTrx(trx);
    setOpenDetail(true);
  };

  const closeDetailDrawer = () => {
    setOpenDetail(false);
    setSelectedTrx(undefined);
  };

  useEffect(() => {
    if (openTrxDrawer) {
      fetchTrx();
    }
  }, [openTrxDrawer]);

  const fetchTrx = async () => {
    setLoading(true);
    const response = await getTodayTransaction();
    if (response.success) {
      setTrx(response.data);
    }
    setLoading(false);
  };

  return (
    <Drawer
      open={openTrxDrawer}
      onClose={() => setOpenTrxDrawer(false)}
      title={'History Transaksi'}
    >
      <Spin spinning={loading}>
        <List
          dataSource={trx}
          itemLayout="vertical"
          renderItem={(item, index) => {
            const isVoid = item.deleted_at != undefined;
            return (
              <List.Item key={index.toFixed()} style={{ position: 'relative' }}>
                <Flex style={{ width: '100%' }} justify="space-between">
                  <Flex style={{ width: '100%' }} gap={'4px'} vertical>
                    <span style={{ fontSize: '10pt', color: 'blue' }}>
                      <ClockCircleOutlined style={{ marginRight: '4px' }} />{' '}
                      {formatDateTime(item.created_at, 'DD/MM/YYYY HH:mm:ss', isoDateFormat)}
                    </span>
                    <span style={{ fontSize: '10pt' }}>
                      <OrderedListOutlined style={{ marginRight: '4px' }} /> {item.order_no}
                    </span>
                    <span style={{ fontSize: '10pt' }}>
                      <UserOutlined style={{ marginRight: '4px' }} />{' '}
                      {item.member?.name ?? 'NON MEMBER'}
                    </span>
                  </Flex>
                  <Flex style={{ width: '100%', alignItems: 'flex-end' }} gap={'4px'} vertical>
                    <div style={slashedTextStyle}>
                      <h3 style={{ marginBottom: '0px' }}>{formatRupiah(item.total_amount)}</h3>
                      <span style={isVoid ? slashLineStyle : undefined}></span>
                    </div>
                    <span style={{ fontSize: '10pt' }}>
                      {mapPaymentMethodName(item.payment_method.code)}
                    </span>
                    <span style={{ fontSize: '10pt' }}>{item.total_item} Item</span>
                  </Flex>
                </Flex>

                <Flex style={{ width: '100%' }} justify="flex-end">
                  <Button onClick={() => openDetailDrawer(item)} size="small" type="link">
                    Lihat
                  </Button>
                  |
                  {!isVoid && (
                    <Button onClick={() => printTrx(item)} size="small" type="link">
                      <PrinterOutlined /> Cetak
                    </Button>
                  )}
                </Flex>

                {isVoid && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) rotate(-10deg)',
                      fontWeight: 'bold',
                      color: 'rgba(255,0,0,0.2)',
                      fontSize: '48pt',
                    }}
                  >
                    VOID
                  </span>
                )}
              </List.Item>
            );
          }}
        />
      </Spin>

      <TransactionDetail
        transaction={selectedTrx}
        open={openDetail}
        onClose={closeDetailDrawer}
        onVoid={fetchTrx}
      />
    </Drawer>
  );
};

export default TransactionHistory;
