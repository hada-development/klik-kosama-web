import {
  ModalForm,
  ProFormInstance,
  ProFormText,
  ProFormTimePicker,
} from '@ant-design/pro-components';

import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { addShift, editShift } from '../data/services/service';

export type ShiftFormProps = {
  onCancel: (flag?: boolean, formVals?: ShiftFeature.ShiftListItem) => void;
  onSubmit: (values: ShiftFeature.ShiftListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<ShiftFeature.ShiftListItem>;
};

const ShiftForm: React.FC<ShiftFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);
    } else {
      formRef.current?.resetFields();
    }
  }, [props.open, props.values, formRef]);

  const handleSubmit = async (values: ShiftFeature.ShiftListItem) => {
    try {
      if (props.values) {
        await editShift(props.values.id, values);
      } else {
        await addShift(values);
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
      title={props.values != undefined ? 'Edit Shift' : 'Tambah Shift'}
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
            message: 'Shift Name Is Required',
          },
        ]}
        placeholder="Masukkan Nama Shift"
        width="md"
        name="name"
        label="Nama Shift"
      />

      <ProFormTimePicker
        rules={[
          {
            required: true,
            message: 'Start Time Is Required',
          },
        ]}
        placeholder="Masukkan Jam Masuk"
        width="md"
        name="start_time"
        label="Jam Masuk"
      />

      <ProFormTimePicker
        rules={[
          {
            required: true,
            message: 'End Time Is Required',
          },
        ]}
        placeholder="Masukkan Jam Pulang"
        width="md"
        name="end_time"
        label="Jam Pulang"
      />
    </ModalForm>
  );
};

export default ShiftForm;
