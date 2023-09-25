import { ModalForm, ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-components';

import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { payrollComponentType } from '../data/data';
import { addPayrollComponent, editPayrollComponent } from '../data/services/service';

export type PayrollComponentFormProps = {
  onCancel: (flag?: boolean, formVals?: PayrollComponentFeature.PayrollComponentListItem) => void;
  onSubmit: (values: PayrollComponentFeature.PayrollComponentListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<PayrollComponentFeature.PayrollComponentListItem>;
};

const PayrollComponentForm: React.FC<PayrollComponentFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);
    } else {
      formRef.current?.resetFields();
    }
  }, [props.open, props.values, formRef]);

  const handleSubmit = async (values: PayrollComponentFeature.PayrollComponentListItem) => {
    try {
      if (props.values) {
        await editPayrollComponent(props.values.id, values);
      } else {
        await addPayrollComponent(values);
      }
      props.onSubmit(values);
    } catch (error) {
      console.error(error);
    } finally {
      props.onCancel();
    }
  };

  return (
    <ModalForm
      title={props.values != undefined ? 'Edit Posisi' : 'Tambah Posisi'}
      width="400px"
      formRef={formRef}
      open={props.open}
      onOpenChange={props.setOpen}
      onFinish={async (value) => {
        await handleSubmit(value);
        props.setOpen!(false);
      }}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: 'PayrollComponent Name Is Required',
          },
        ]}
        placeholder="Masukkan Nama Posisi"
        width="md"
        name="name"
        label="Nama Posisi"
      />

      <ProFormSelect
        name="type"
        label="Jenis Komponen Gaji"
        width={'md'}
        valueEnum={payrollComponentType}
        placeholder="Pilih Jenis Komponen Gaji"
        rules={[
          {
            required: true,
            message: 'Required',
          },
        ]}
      />
    </ModalForm>
  );
};

export default PayrollComponentForm;
