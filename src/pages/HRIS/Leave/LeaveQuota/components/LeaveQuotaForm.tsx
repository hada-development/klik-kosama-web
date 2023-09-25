import { ModalForm, ProFormDigit, ProFormInstance } from '@ant-design/pro-components';

import { formatDateTime } from '@/common/utils/utils';
import { Descriptions } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { addLeaveQuota, editLeaveQuota } from '../data/services/service';

export type LeaveQuotaFormProps = {
  onCancel: (flag?: boolean, formVals?: LeaveQuotaFeature.LeaveQuotaListItem) => void;
  onSubmit: (values: LeaveQuotaFeature.LeaveQuotaListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<LeaveQuotaFeature.LeaveQuotaListItem>;
};

const LeaveQuotaForm: React.FC<LeaveQuotaFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);
    } else {
      formRef.current?.resetFields();
    }
  }, [props.open, props.values, formRef]);

  const handleSubmit = async (values: LeaveQuotaFeature.LeaveQuotaListItem) => {
    try {
      if (props.values) {
        await editLeaveQuota(props.values.id, values);
      } else {
        await addLeaveQuota(values);
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
      <Descriptions
        layout="vertical"
        items={[
          {
            key: 'name',
            label: 'Nama Pegawai',
            span: 3,
            children: props.values?.employee?.user.name,
          },
          {
            key: 'start_period',
            label: 'Awal Periode',
            children: formatDateTime(props.values?.start_period, 'DD/MM/YYYY'),
          },
          {
            key: 'end_period',
            label: 'Akhir Periode',
            children: formatDateTime(props.values?.end_period, 'DD/MM/YYYY'),
          },
        ]}
      />

      <ProFormDigit
        rules={[
          {
            required: true,
            message: 'LeaveQuota Name Is Required',
          },
        ]}
        placeholder="Masukkan Quota"
        width="md"
        max={12}
        min={0}
        name="quota"
        label="Quota"
      />
    </ModalForm>
  );
};

export default LeaveQuotaForm;
