import {
  ModalForm,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';

import React, { Dispatch, SetStateAction, useRef, useEffect } from 'react';
import { addEmployeeType, editEmployeeType } from '../data/services/service';


export type EmployeeTypeFormProps = {
  onCancel: (flag?: boolean, formVals?: EmployeeTypeFeature.EmployeeTypeListItem) => void;
  onSubmit: (values: EmployeeTypeFeature.EmployeeTypeListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<EmployeeTypeFeature.EmployeeTypeListItem>;
};

const EmployeeTypeForm: React.FC<EmployeeTypeFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);
    }else{
      formRef.current?.resetFields();
    }
    
  }, [props.open, props.values, formRef]);

  const handleSubmit = async (values: EmployeeTypeFeature.EmployeeTypeListItem) => {
    try {
      if (props.values) {
        await editEmployeeType(props.values.id, values);
      } else {
        await addEmployeeType(values);
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
      title={props.values != undefined ? "Edit Jenis Pegawai" : "Tambah Jenis Pegawai"}
      width="400px"
      formRef={formRef}
      open={props.open}
      onOpenChange={props.setOpen}
      initialValues={{ name: props.values?.name }}

      onFinish={async (value) => {
        await handleSubmit(value);
        props.setOpen!(false);
      }}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: "EmployeeType Name Is Required",
          },
        ]}
        placeholder="Masukkan Nama Jenis Pegawai"
        width="md"
        name="name"
        label="Nama Jenis Pegawai"
      />

    </ModalForm>
  );
};

export default EmployeeTypeForm;
