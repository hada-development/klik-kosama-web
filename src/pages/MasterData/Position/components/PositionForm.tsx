import {
  ModalForm,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';

import React, { Dispatch, SetStateAction, useRef, useEffect } from 'react';
import { addPosition, editPosition } from '../data/services/service';


export type PositionFormProps = {
  onCancel: (flag?: boolean, formVals?: PositionFeature.PositionListItem) => void;
  onSubmit: (values: PositionFeature.PositionListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<PositionFeature.PositionListItem>;
};

const PositionForm: React.FC<PositionFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);
    }else{
      formRef.current?.resetFields();
    }
    
  }, [props.open, props.values, formRef]);

  const handleSubmit = async (values: PositionFeature.PositionListItem) => {
    try {
      if (props.values) {
        await editPosition(props.values.id, values);
      } else {
        await addPosition(values);
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
      title={props.values != undefined ? "Edit Posisi" : "Tambah Posisi"}
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
            message: "Position Name Is Required",
          },
        ]}
        placeholder="Masukkan Nama Posisi"
        width="md"
        name="name"
        label="Nama Posisi"
      />

    </ModalForm>
  );
};

export default PositionForm;
