import { formatRupiah } from '@/common/utils/utils';
import { ShoppingTwoTone } from '@ant-design/icons';
import { Drawer, Flex, List, Typography } from 'antd';
import Button from 'antd-button-color';
import { useEffect, useState } from 'react';
import { AppOrderListItem, mapAppOrderStatusTag } from '../../data/data';
import { getAppOrder } from '../../data/service';
import AppOrderDetailModal from './Widget/Detail';

import { useModel } from '@umijs/max';
import 'antd-button-color/dist/css/style.less';

const { Title, Paragraph, Text, Link } = Typography;

type Props = {
  open: boolean;
  onClose: () => void;
};

function AppOrderDrawer({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<AppOrderListItem[]>([]);

  const [openDetail, setOpenDetail] = useState(false);
  const [detailId, setDetailId] = useState<number | undefined>();

  const { prepareAppOrder } = useModel('POS.usePos');

  useEffect(() => {
    if (open) {
      getData();
    }
  }, [open]);

  const getData = () => {
    setLoading(true);
    getAppOrder()
      .then((response) => {
        if (response.success) {
          setOrders(response.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const showDetail = (id: number) => {
    setDetailId(id);
    setOpenDetail(true);
  };

  const closeDetail = () => {
    setDetailId(undefined);
    setOpenDetail(false);
  };

  const prepapreOnPos = (id: number) => {
    prepareAppOrder(id);
    onClose();
  };

  return (
    <>
      <Drawer title="Pesanan Dari Aplikasi" open={open} width={500} onClose={onClose}>
        <List
          loading={loading}
          dataSource={orders}
          itemLayout="vertical"
          renderItem={(item, index) => {
            return (
              <List.Item key={item.order_no}>
                <Flex justify="space-between" align="flex-start" style={{ width: '100%' }}>
                  <Flex gap={'small'}>
                    <ShoppingTwoTone style={{ fontSize: '32px' }} />
                    <Flex vertical>
                      <Text> {item.member_name}</Text>
                      <Text type="secondary" style={{ fontSize: '8pt' }}>
                        {item.order_no}
                      </Text>
                    </Flex>
                  </Flex>
                  {mapAppOrderStatusTag[item.status]}
                </Flex>
                <hr style={{ border: '0.2px solid #e8e8e8' }} />
                <Text>{item.item_quantity}x</Text> <Text strong>{item.item_product_name}</Text>
                {item.item_other_count > 0 && (
                  <Text style={{ display: 'block', fontSize: '8pt' }}>
                    +{item.item_other_count} Produk Lainnya
                  </Text>
                )}
                <Flex
                  justify="space-between"
                  align="flex-end"
                  style={{ width: '100%', paddingBottom: '12px' }}
                >
                  <Flex vertical>
                    <Text style={{ display: 'flex', fontSize: '10pt', marginTop: '12px' }}>
                      Total Belanja
                    </Text>
                    <Text strong>{formatRupiah(item.total_shopping)}</Text>
                  </Flex>

                  <Flex gap={'small'}>
                    {item.status == 'ready-to-pickup' && (
                      <Button type="success" onClick={() => prepapreOnPos(item.id)} size="small">
                        Siapkan di Kasir
                      </Button>
                    )}
                    <Button type="primary" onClick={() => showDetail(item.id)} size="small">
                      Detail
                    </Button>
                  </Flex>
                </Flex>
              </List.Item>
            );
          }}
        />
      </Drawer>

      <AppOrderDetailModal
        open={openDetail}
        onClose={closeDetail}
        onUpdated={getData}
        id={detailId}
      />
    </>
  );
}

export default AppOrderDrawer;
