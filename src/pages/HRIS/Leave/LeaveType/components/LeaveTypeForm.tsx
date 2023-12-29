import { ModalForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';

import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { addLeaveType, editLeaveType } from '../data/services/service';

export type LeaveTypeFormProps = {
  onCancel: (flag?: boolean, formVals?: LeaveTypeFeature.LeaveTypeListItem) => void;
  onSubmit: (values: LeaveTypeFeature.LeaveTypeListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<LeaveTypeFeature.LeaveTypeListItem>;
};

const LeaveTypeForm: React.FC<LeaveTypeFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);
    } else {
      formRef.current?.resetFields();
    }
  }, [props.open, props.values, formRef]);

  const handleSubmit = async (values: LeaveTypeFeature.LeaveTypeListItem) => {
    try {
      if (props.values) {
        await editLeaveType(props.values.id, values);
      } else {
        await addLeaveType(values);
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
      title={props.values != undefined ? 'Edit LeaveType' : 'Tambah LeaveType'}
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
            message: 'Jenis Cuti Name Is Required',
          },
        ]}
        placeholder="Masukkan Nama LeaveType"
        width="md"
        name="name"
        label="Nama Jenis Cuti"
      />
    </ModalForm>
  );
};

export default LeaveTypeForm;
