import { ModalForm, ProFormInstance } from '@ant-design/pro-components';

import { formatDateTime } from '@/common/utils/utils';
import { green, red } from '@ant-design/colors';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Descriptions, Flex, Spin } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import {
  addLeaveSubmission,
  approvalLeaveSubmission,
  editLeaveSubmission,
} from '../data/services/service';

export type LeaveSubmissionFormProps = {
  onCancel: (flag?: boolean, formVals?: LeaveSubmissionFeature.LeaveSubmissionListItem) => void;
  onSubmit: (values?: LeaveSubmissionFeature.LeaveSubmissionListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<LeaveSubmissionFeature.LeaveSubmissionListItem>;
};

const LeaveSubmissionForm: React.FC<LeaveSubmissionFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();
  const { initialState } = useModel('@@initialState');
  const [loading, setLoading] = useState<boolean>(false);

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

  const handleReview = async (type: string) => {
    setLoading(true);
    await approvalLeaveSubmission(props.values!.id!, type);
    setLoading(false);
    props.setOpen!(false);
    props.onSubmit();
  };

  return (
    <Spin spinning={loading}>
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
        submitter={{
          render: () =>
            props.values?.parent_submission?.current_step?.user_ids.includes(
              initialState?.currentUser?.id,
            ) ? (
              <Flex>
                <Button
                  onClick={() => handleReview('rejected')}
                  type="primary"
                  style={{ backgroundColor: red.primary }}
                  icon={<CloseCircleOutlined />}
                >
                  Tolak
                </Button>
                <Button
                  onClick={() => handleReview('accepted')}
                  type="primary"
                  style={{ backgroundColor: green.primary }}
                  icon={<CheckCircleOutlined />}
                >
                  Setujui
                </Button>
              </Flex>
            ) : (
              <></>
            ),
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

            {
              key: 'status',
              label: 'Status',
              children: `${props.values?.parent_submission?.current_step.title}`,
            },
          ]}
        />
      </ModalForm>
    </Spin>
  );
};

export default LeaveSubmissionForm;
