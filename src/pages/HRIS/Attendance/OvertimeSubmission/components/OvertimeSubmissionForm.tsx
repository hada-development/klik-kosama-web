import {
  ModalForm,
  ProFormDatePicker,
  ProFormInstance,
  ProFormTimePicker,
} from '@ant-design/pro-components';

import { green, red } from '@ant-design/colors';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { ProFormGroup } from '@ant-design/pro-form/lib';
import { useModel } from '@umijs/max';
import { Button, Descriptions, Divider, Flex, Image, Spin } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import {
  addOvertimeSubmission,
  approvalOvertimeSubmission,
  editOvertimeSubmission,
} from '../data/services/service';

export type OvertimeSubmissionFormProps = {
  onCancel: (
    flag?: boolean,
    formVals?: OvertimeSubmissionFeature.OvertimeSubmissionListItem,
  ) => void;
  onSubmit: (values?: OvertimeSubmissionFeature.OvertimeSubmissionListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<OvertimeSubmissionFeature.OvertimeSubmissionListItem>;
};

const OvertimeSubmissionForm: React.FC<OvertimeSubmissionFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();
  const [loading, setLoading] = useState<boolean>(false);

  const { initialState } = useModel('@@initialState');

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue({
        ...props.values,
        status: props.values.parent_submission.status,
      });
      console.log({ ...props.values });
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

  const handleReview = async (type: string) => {
    setLoading(true);
    await approvalOvertimeSubmission(props.values!.id!, type);
    setLoading(false);
    props.setOpen!(false);
    props.onSubmit();
  };

  return (
    <Spin spinning={loading}>
      <ModalForm
        title={props.values !== undefined ? 'Edit Pengajuan Lembur' : 'Tambah Pengajuan Lembur'}
        width="600px"
        formRef={formRef}
        open={props.open}
        onOpenChange={props.setOpen}
        onFinish={async (value) => {
          await handleSubmit(value);
          props.setOpen!(false);
        }}
        submitter={{
          render: (subProps) =>
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
              <Flex>
                <Button
                  onClick={() => subProps.form?.submit()}
                  type="primary"
                  icon={<CheckCircleOutlined />}
                >
                  Simpan
                </Button>
              </Flex>
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
              key: 'status',
              label: 'Status',
              span: 10,
              children: props.values?.parent_submission?.current_step.title,
            },
          ]}
        />

        <Divider></Divider>
        <ProFormGroup>
          <ProFormDatePicker name={'date'} label={'Tanggal'} width={'xl'} />

          <ProFormTimePicker name={'start_time'} label={'Dari'} width={'sm'} />

          <ProFormTimePicker name={'end_time'} label={'Sampai'} width={'sm'} />
        </ProFormGroup>
      </ModalForm>
    </Spin>
  );
};

export default OvertimeSubmissionForm;
