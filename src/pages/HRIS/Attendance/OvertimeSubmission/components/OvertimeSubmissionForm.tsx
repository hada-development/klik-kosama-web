import { ModalForm, ProFormInstance, ProFormSelect } from '@ant-design/pro-components';

import { submissionStatuses } from '@/common/data/data';
import { Descriptions, Image } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { addOvertimeSubmission, editOvertimeSubmission } from '../data/services/service';

export type OvertimeSubmissionFormProps = {
  onCancel: (
    flag?: boolean,
    formVals?: OvertimeSubmissionFeature.OvertimeSubmissionListItem,
  ) => void;
  onSubmit: (values: OvertimeSubmissionFeature.OvertimeSubmissionListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<OvertimeSubmissionFeature.OvertimeSubmissionListItem>;
};

const OvertimeSubmissionForm: React.FC<OvertimeSubmissionFormProps> = (props) => {
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

  const handleSubmit = async (values: OvertimeSubmissionFeature.OvertimeSubmissionListItem) => {
    try {
      if (props.values) {
        await editOvertimeSubmission(props.values.id, values);
      } else {
        await addOvertimeSubmission(values);
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
            label: 'Catatan',
            span: 10,
            children: props.values?.note,
          },

          {
            key: 'reason',
            label: 'Bukti',
            span: 10,
            children: (
              <>
                {props.values?.file && (
                  <Image
                    width={'100%'}
                    height={'200px'}
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'top',
                    }}
                    src={props.values?.file?.address}
                  />
                )}
              </>
            ),
          },
          {
            key: 'start_period',
            label: 'Dari',
            children: props.values?.start_time,
          },
          {
            key: 'end_period',
            label: 'Sampai',
            children: props.values?.end_time,
          },

          {
            key: 'total_day',
            label: 'Jumlah ',
            children: `${props.values?.minutes} Mnt`,
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

export default OvertimeSubmissionForm;
