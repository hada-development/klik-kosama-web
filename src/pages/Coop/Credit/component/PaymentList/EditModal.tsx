import {
  ModalForm,
  ProFormDatePicker,
  ProFormInstance,
  ProFormMoney,
  ProFormTextArea,
} from '@ant-design/pro-components';
import confirm from 'antd/es/modal/confirm';
import React, { useEffect, useRef } from 'react';
import { PaymentHistory } from '../../data/data';
import { addPayment, editPayment } from '../../data/services';

type PaymentFormModalProp = {
  creditId: number;
  payment?: PaymentHistory;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onUpdate: () => void;
  defaultAmount?: number;
};

const PaymentFormModal: React.FC<PaymentFormModalProp> = (prop) => {
  const formRef = useRef<ProFormInstance>();
  useEffect(() => {
    formRef.current?.resetFields();
    if (prop.defaultAmount) {
      formRef.current?.setFieldsValue({
        amount: prop.defaultAmount,
      });
    }
    if (prop.payment) {
      formRef.current?.setFieldsValue(prop.payment);
    }
  }, [prop]);

  async function confirmSubmit(value: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      confirm({
        title: 'Sudah benar?',
        content: 'Anda yakin ingin menyimpan pembayaran ini',
        okCancel: true,
        onOk: () => {
          handleSubmit(value).then((val) => resolve(val));
        },
        onCancel: () => {
          reject();
        },
      });
    });
  }

  async function handleSubmit(value: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (prop.payment?.id) {
        editPayment(prop.creditId, prop.payment.id!, value)
          .then((_) => {
            prop.onUpdate();
            resolve(true);
          })
          .catch((e: any) => {
            console.log(e);
            reject(e);
          });
      } else {
        addPayment(prop.creditId, value)
          .then((_) => {
            prop.onUpdate();
            resolve(true);
          })
          .catch((_) => reject(_));
      }
    });
  }

  return (
    <ModalForm
      formRef={formRef}
      width={500}
      title={prop.payment ? 'Edit Pembayaran' : 'Input Pembayaran'}
      open={prop.isOpen}
      onOpenChange={prop.setIsOpen}
      onFinish={async (value) => {
        return confirmSubmit(value);
      }}
    >
      <ProFormDatePicker
        label="Tanggal Pembayaran"
        name="date"
        width={'xl'}
        placeholder={'Masukkan Tanggal'}
        rules={[{ required: true, message: 'wajib diisi' }]}
      />

      <ProFormMoney
        label="Jumlah Pembayaran"
        name="amount"
        locale="id-ID"
        placeholder={'Masukkan Nominal'}
        min={0}
        rules={[{ required: true, message: 'wajib diisi' }]}
      />

      <ProFormTextArea label="Catatan" name="note" />
    </ModalForm>
  );
};

export default PaymentFormModal;
