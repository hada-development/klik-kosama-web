import { formatDateTime, formatRupiah } from '@/common/utils/utils';
import { CloseOutlined, GiftOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Card, Flex, List, Modal, theme as antdTheme } from 'antd';
import Input, { InputRef } from 'antd/es/input/Input';
import { useEffect, useRef, useState } from 'react';
import { POSVoucher } from '../data/data';
import { getVouchers } from '../data/service';

type Props = {};

export default function VoucherPicker({}: Props) {
  const { useToken } = antdTheme;
  const { token: theme } = useToken();
  const { member, voucher, changeVoucher } = useModel('POS.usePos');
  const [vouchers, setVouchers] = useState<POSVoucher[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [searchBarcode, setSearchBarcode] = useState('');
  const barcodeInputRef = useRef<InputRef>(null);

  var hasVoucher = voucher != undefined;

  const handleButton = () => {
    if (hasVoucher) {
      changeVoucher(undefined);
    } else {
      setModalOpen(true);
    }
  };

  useEffect(() => {
    if (modalOpen && barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [modalOpen]);

  useEffect(() => {
    setVouchers([]);
    if (searchBarcode.length > 0) {
      console.log(searchBarcode);
      getVouchers(searchBarcode).then((response) => {
        setVouchers(response.data);
      });
    }
  }, [searchBarcode]);

  return (
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
        {/* Please add input that when user input barcode it search barcode then show below */}
        <Input
          ref={barcodeInputRef}
          placeholder="Enter barcode..."
          value={searchBarcode}
          onChange={(e) => setSearchBarcode(e.target.value)}
        />
        <List
          dataSource={vouchers}
          renderItem={(item, index) => (
            <List.Item>
              <Card
                onClick={() => {
                  changeVoucher(item);
                  setModalOpen(false);
                  setSearchBarcode('');
                  setVouchers([]);
                }}
                className="voucher-card"
              >
                <Flex justify="space-between">
                  <span>{item.name}</span>
                  <span>{item.barcode}</span>
                </Flex>
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
  );
}
