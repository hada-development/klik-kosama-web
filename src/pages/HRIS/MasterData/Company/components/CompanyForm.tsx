import { ModalForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';

import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { addCompany, editCompany } from '../data/services/service';

export type CompanyFormProps = {
  onCancel: (flag?: boolean, formVals?: CompanyFeature.CompanyListItem) => void;
  onSubmit: (values: CompanyFeature.CompanyListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<CompanyFeature.CompanyListItem>;
};

const CompanyForm: React.FC<CompanyFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);
    } else {
      formRef.current?.resetFields();
    }
  }, [props.open, props.values, formRef]);

  const handleSubmit = async (values: CompanyFeature.CompanyListItem) => {
    try {
      if (props.values) {
        await editCompany(props.values.id, values);
      } else {
        await addCompany(values);
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
      title={props.values != undefined ? 'Edit Instansi' : 'Tambah Instansi'}
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
            message: 'Company Name Is Required',
          },
        ]}
        placeholder="Masukkan Nama Instansi"
        width="md"
        name="name"
        label="Nama Instansi"
      />
    </ModalForm>
  );
};

export default CompanyForm;
