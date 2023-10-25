import { ModalForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';

import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { addSupplier, editSupplier } from '../data/services/service';

export type SupplierFormProps = {
  onCancel: (flag?: boolean, formVals?: SupplierFeature.SupplierListItem) => void;
  onSubmit: (values: SupplierFeature.SupplierListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<SupplierFeature.SupplierListItem>;
};

const SupplierForm: React.FC<SupplierFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);
    } else {
      formRef.current?.resetFields();
    }
  }, [props.open, props.values, formRef]);

  const handleSubmit = async (values: SupplierFeature.SupplierListItem) => {
    try {
      if (props.values) {
        await editSupplier(props.values.id, values);
      } else {
        await addSupplier(values);
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
      title={props.values != undefined ? 'Edit Supplier' : 'Tambah Supplier'}
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
            message: 'Supplier Name Is Required',
          },
        ]}
        placeholder="Masukkan Nama Supplier"
        width="md"
        name="name"
        label="Nama Supplier"
      />

      <ProFormText
        placeholder="Masukkan Alamat Supplier"
        width="md"
        name="address"
        label="Alamat Supplier"
      />

      <ProFormText
        placeholder="Masukkan npwp Supplier"
        width="md"
        name="npwp"
        label="NPWP Supplier"
      />

      <ProFormText
        placeholder="Masukkan Keterangan / catatan"
        width="md"
        name="description"
        label="Keterangan"
      />
    </ModalForm>
  );
};

export default SupplierForm;
