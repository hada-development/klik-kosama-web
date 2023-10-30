import { formatRupiah } from '@/common/utils/utils';
import { PrinterOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Flex, InputNumber, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { POSTransaction } from '../data/data';
import POSButton from './POSButton';
import Receipt from './Receipt';

type Props = {};

const rupiahDenom = [100000, 50000, 20000, 10000, 5000, 2000, 1000];

const PaymentModalCash = (props: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [payment, setPayment] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    paymentMethod,
    totalAmount,
    totalItems,

    openCheckoutModal,
    setOpenCheckoutModal,
    handleCheckout,
    clearPos,
  } = useModel('POS.usePos');

  const printReceipt = (transaction: POSTransaction) => {
    const receiptWindow = window.open('', '_blank');
    const receiptContent = (
      <div style={{ fontFamily: 'monospace' }}>
        <Receipt transaction={transaction} paid={payment} change={payment - totalAmount} />
      </div>
    );
    // Render the JSX to a string using ReactDOMServer
    const contentString = ReactDOMServer.renderToStaticMarkup(receiptContent);

    receiptWindow?.document.write(contentString);
    receiptWindow?.print();
    receiptWindow?.close();
  };

  const handleSubmit = async () => {
    setLoading(true);
    const transaction = await handleCheckout();
    console.log(transaction);
    clearPos();
    printReceipt(transaction);
    setOpenCheckoutModal(false);
    setLoading(false);
  };

  useEffect(() => {
    setPayment(totalAmount);
  }, [totalAmount]);

  useEffect(() => {
    if (openCheckoutModal) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      setPayment(totalAmount);
    }
  }, [openCheckoutModal]);

  const handleCancel = () => {
    setOpenCheckoutModal(false);
  };

  return (
    <Modal
      open={openCheckoutModal}
      closable={true}
      onCancel={handleCancel}
      title="Checkout"
      footer={false}
    >
      <Flex vertical>
        <span>Total Belanja</span>
        <h2>{formatRupiah(totalAmount)}</h2>
      </Flex>

      <span>Total Pembayaran</span>
      <InputNumber
        style={{
          width: '100%',
          fontSize: '16pt',
          textAlign: 'end',
        }}
        ref={inputRef}
        value={payment.toString()}
        onChange={(value) => {
          if (value) {
            setPayment(parseInt(value));
          }
        }}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
        placeholder={'(Rp) Pembayaran'}
      />

      <Flex gap={'small'} wrap={'wrap'} style={{ marginTop: '12px' }}>
        {rupiahDenom.map((e) => (
          <Button onClick={() => setPayment(e)} disabled={e < totalAmount}>
            {formatRupiah(e)}
          </Button>
        ))}
      </Flex>

      <span style={{ marginTop: '12px', display: 'block' }}>Kembalian</span>

      {payment - totalAmount > 0 ? (
        <h1 style={{ color: 'green' }}>{formatRupiah(payment - totalAmount)}</h1>
      ) : (
        <h1 style={{ color: 'red' }}>Rp 0</h1>
      )}

      <POSButton
        icon={<PrinterOutlined style={{ fontSize: '24px' }} />}
        type="primary"
        title="Simpan & Cetak"
        loading={loading}
        onClick={handleSubmit}
      />
    </Modal>
  );
};

export default PaymentModalCash;
