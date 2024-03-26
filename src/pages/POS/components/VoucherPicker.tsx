import { formatDateTime, formatRupiah } from '@/common/utils/utils';
import { DeleteOutlined, EditOutlined, GiftOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Card, Flex, List, Modal, theme as antdTheme } from 'antd';
import Input, { InputRef } from 'antd/es/input/Input';
import { useEffect, useRef, useState } from 'react';
import { POSVoucher } from '../data/data';
import { getVouchers } from '../data/service';

export default function VoucherPicker() {
  const { useToken } = antdTheme;
  const { token: theme } = useToken();
  const { vouchers, addVoucher, removeVoucher, getTotalVoucher } = useModel('POS.usePos');
  const [voucherList, setVoucherList] = useState<POSVoucher[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [searchBarcode, setSearchBarcode] = useState('');
  const barcodeInputRef = useRef<InputRef>(null);

  let hasVoucher = vouchers.length > 0;

  const handleButton = () => {
    setModalOpen(true);
  };

  const handleRemoveVoucher = (id: number) => {
    removeVoucher(id);
  };

  useEffect(() => {
    if (modalOpen && barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [modalOpen]);

  useEffect(() => {
    setVoucherList([]);
    if (searchBarcode.length > 0) {
      console.log(searchBarcode);
      getVouchers(searchBarcode).then((response) => {
        setVoucherList(response.data);
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
          <strong>{hasVoucher ? formatRupiah(getTotalVoucher()) : 'Pakai Voucher'}</strong>
        </div>
        <Button
          onClick={handleButton}
          type="text"
          style={{ color: hasVoucher ? 'white' : undefined }}
        >
          {hasVoucher ? <EditOutlined /> : <PlusOutlined />}
        </Button>
      </div>
      <Modal
        open={modalOpen}
        title={'Pilih Voucher'}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Input
          ref={barcodeInputRef}
          placeholder="Enter barcode..."
          value={searchBarcode}
          onChange={(e) => setSearchBarcode(e.target.value)}
        />
        <List
          dataSource={voucherList}
          renderItem={(item) => (
            <List.Item>
              <Card
                onClick={() => {
                  addVoucher(item);
                  setModalOpen(false);
                  setSearchBarcode('');
                  setVoucherList([]);
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

        <h5>Voucher Digunakan</h5>
        <List
          dataSource={vouchers}
          renderItem={(item) => (
            <List.Item>
              <Card className="voucher-card">
                <Flex justify="space-between">
                  <span>{item.name}</span>
                  <span>{item.barcode}</span>
                </Flex>
                <h3 style={{ marginBottom: '2px' }}>{formatRupiah(item.amount)}</h3>
                <Flex justify="space-between">
                  <span style={{ fontSize: '8pt' }}>
                    EXP: {formatDateTime(item.expired_at, 'DD/MM/YYYY')}
                  </span>
                  <Button
                    onClick={() => {
                      handleRemoveVoucher(item.id);
                      setModalOpen(false);
                      setSearchBarcode('');
                      setVoucherList([]);
                    }}
                    type="dashed"
                    danger={true}
                  >
                    <DeleteOutlined />
                  </Button>
                </Flex>
              </Card>
            </List.Item>
          )}
        ></List>
      </Modal>
    </>
  );
}
