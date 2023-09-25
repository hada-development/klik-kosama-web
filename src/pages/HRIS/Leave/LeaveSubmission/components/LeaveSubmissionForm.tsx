import { ModalForm, ProFormInstance, ProFormSelect } from '@ant-design/pro-components';

import { submissionStatuses } from '@/common/data/data';
import { formatDateTime } from '@/common/utils/utils';
import { Descriptions } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { addLeaveSubmission, editLeaveSubmission } from '../data/services/service';

export type LeaveSubmissionFormProps = {
  onCancel: (flag?: boolean, formVals?: LeaveSubmissionFeature.LeaveSubmissionListItem) => void;
  onSubmit: (values: LeaveSubmissionFeature.LeaveSubmissionListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<LeaveSubmissionFeature.LeaveSubmissionListItem>;
};

const LeaveSubmissionForm: React.FC<LeaveSubmissionFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue({
        ...props.values,
        status: props.values.parent_submission.status,
      });
    } else {
      formRef.current?.resetFields();
    }
  }, [props.open, props.values, formRef]);

  const handleSubmit = async (values: LeaveSubmissionFeature.LeaveSubmissionListItem) => {
    try {
      if (props.values) {
        await editLeaveSubmission(props.values.id, values);
      } else {
        await addLeaveSubmission(values);
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
      title={props.values != undefined ? 'Edit Pengajuan Cuti' : 'Tambah Pengajuan Cuti'}
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
            span: 10,
            children: props.values?.parent_submission?.employee?.user.name,
          },
          {
            key: 'reason',
            label: 'Alasan',
            span: 10,
            children: props.values?.note,
          },
          {
            key: 'start_period',
            label: 'Dari',
            children: formatDateTime(props.values?.start_date, 'DD/MM/YYYY'),
          },
          {
            key: 'end_period',
            label: 'Sampai',
            children: formatDateTime(props.values?.start_date, 'DD/MM/YYYY'),
          },

          {
            key: 'total_day',
            label: 'Jumlah ',
            children: `${props.values?.total_days} Hari`,
          },
        ]}
      />

      <ProFormSelect
        name="status"
        label="Status"
        valueEnum={submissionStatuses}
        placeholder="Pilih Status"
        rules={[{ required: true, message: 'Please select status!' }]}
      />
    </ModalForm>
  );
};

export default LeaveSubmissionForm;
