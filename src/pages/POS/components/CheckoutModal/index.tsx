import { formatRupiah } from '@/common/utils/utils';
import { PrinterOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Flex, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { mapPaymentMethodName } from '../../data/data';
import POSButton from '../POSButton';
import CashForm from './CashForm';

const CheckoutModal = () => {
  const [payment, setPayment] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    paymentMethod,
    totalAmount,
    openCheckoutModal,
    setOpenCheckoutModal,
    handleCheckout,
    clearPos,
  } = useModel('POS.usePos');

  const handleSubmit = async () => {
    setLoading(true);
    const transaction = await handleCheckout(payment);
    console.log(transaction);
    clearPos();
    setOpenCheckoutModal(false);
    setLoading(false);
  };

  useEffect(() => {
    setPayment(totalAmount);
  }, [totalAmount]);

  useEffect(() => {
    if (openCheckoutModal) {
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
        <span>Total Bayar</span>
        <h2>{formatRupiah(totalAmount)}</h2>
      </Flex>

      <span>Pembayaran {mapPaymentMethodName(paymentMethod.code)}</span>

      {paymentMethod.code === 'cash' && <CashForm payment={payment} setPayment={setPayment} />}

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

export default CheckoutModal;
