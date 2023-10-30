import { formatDateTime, formatRupiah } from '@/common/utils/utils';
import { CloseOutlined, GiftOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Card, List, Modal, theme as antdTheme } from 'antd';
import { useEffect, useState } from 'react';
import { POSVoucher } from '../data/data';
import { getVouchers } from '../data/service';

type Props = {};

export default function VoucherPicker({}: Props) {
  const { useToken } = antdTheme;
  const { token: theme } = useToken();
  const { member, voucher, changeVoucher } = useModel('POS.usePos');

  const [vouchers, setVouchers] = useState<POSVoucher[]>([]);

  const [modalOpen, setModalOpen] = useState(false);

  var hasVoucher = voucher != undefined;

  const handleButton = () => {
    if (hasVoucher) {
      changeVoucher(undefined);
    } else {
      setModalOpen(true);
    }
  };

  useEffect(() => {
    setVouchers([]);
    if (member) {
      console.log(member);
      getVouchers(member.user_id).then((response) => {
        setVouchers(response.data);
      });
    }
  }, [member]);

  return (
    <>
      {member != undefined && (
        <>
          <div
            style={{
              display: 'inline-flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              padding: '10px 20px',
              borderStyle: 'dashed',
              width: '100%',
              height: '68px',
              backgroundColor: hasVoucher ? theme.colorPrimary : undefined,
              color: hasVoucher ? 'white' : undefined,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
              }}
            >
              <span>
                <GiftOutlined /> Voucher
              </span>
              <strong>{hasVoucher ? formatRupiah(voucher?.amount) : 'Pakai Voucher'}</strong>
            </div>
            <Button
              onClick={handleButton}
              type="text"
              style={{ color: hasVoucher ? 'white' : undefined }}
            >
              {hasVoucher ? <CloseOutlined /> : <PlusOutlined />}
            </Button>
          </div>
          <Modal
            open={modalOpen}
            title={'Pilih Voucher'}
            onCancel={() => setModalOpen(false)}
            footer={null}
          >
            <List
              dataSource={vouchers}
              renderItem={(item, index) => (
                <List.Item>
                  <Card
                    onClick={() => {
                      changeVoucher(item);
                      setModalOpen(false);
                    }}
                    className="voucher-card"
                  >
                    <span>{item.name}</span>
                    <h3 style={{ marginBottom: '2px' }}>{formatRupiah(item.amount)}</h3>
                    <span style={{ fontSize: '8pt' }}>
                      EXP: {formatDateTime(item.expired_at, 'DD/MM/YYYY')}
                    </span>
                  </Card>
                </List.Item>
              )}
            ></List>
          </Modal>
        </>
      )}
    </>
  );
}
