import {
  DrawerForm,
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-components';
import React, { Dispatch, SetStateAction, useRef } from 'react';
import { stockTrxTypes } from '../data/data';
import { updateStock } from '../data/services';

const StockForm: React.FC<{
  visible: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  onSubmit: (isSuccess: boolean) => Promise<boolean>;
  StockId?: number;
}> = ({ visible, onClose, onSubmit, StockId }) => {
  const formRef = useRef<ProFormInstance>();
  return (
    <DrawerForm
      formRef={formRef}
      title="Update Stock"
      width={500}
      onOpenChange={onClose}
      open={visible}
      onFinish={async (data) => {
        console.log(data);
        if (StockId) {
          await updateStock(StockId, data);
        }
        await onSubmit(true);
        return true;
      }}
    >
      <ProFormDigit
        rules={[{ required: true }]}
        min={0}
        initialValue={0}
        placeholder="Jumlah"
        width="lg"
        name={'quantity'}
        label="Jumlah"
      />

      <ProFormSelect<String>
        rules={[{ required: true }]}
        name="type"
        options={stockTrxTypes}
        label="Jenis Transaksi"
      />

      <ProFormTextArea
        placeholder="Masukkan Keterangan"
        width="lg"
        name={'notes'}
        label="Keterangan (Opsional)"
      />
    </DrawerForm>
  );
};

export default StockForm;
