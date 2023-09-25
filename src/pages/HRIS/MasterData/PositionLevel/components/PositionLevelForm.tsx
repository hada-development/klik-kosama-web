import { ModalForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';

import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { addPositionLevel, editPositionLevel } from '../data/services/service';

export type PositionLevelFormProps = {
  onCancel: (flag?: boolean, formVals?: PositionLevelFeature.PositionLevelListItem) => void;
  onSubmit: (values: PositionLevelFeature.PositionLevelListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<PositionLevelFeature.PositionLevelListItem>;
};

const PositionLevelForm: React.FC<PositionLevelFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);
    } else {
      formRef.current?.resetFields();
    }
  }, [props.open, props.values, formRef]);

  const handleSubmit = async (values: PositionLevelFeature.PositionLevelListItem) => {
    try {
      if (props.values) {
        await editPositionLevel(props.values.id, values);
      } else {
        await addPositionLevel(values);
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
      <ProFormText
        rules={[
          {
            required: true,
            message: 'PositionLevel Name Is Required',
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

export default PositionLevelForm;
