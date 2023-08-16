import {
  ModalForm,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';

import React, { Dispatch, SetStateAction, useRef, useEffect } from 'react';
import { addEducationLevel, editEducationLevel } from '../data/services/service';


export type EducationLevelFormProps = {
  onCancel: (flag?: boolean, formVals?: EducationLevelFeature.EducationLevelListItem) => void;
  onSubmit: (values: EducationLevelFeature.EducationLevelListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<EducationLevelFeature.EducationLevelListItem>;
};

const EducationLevelForm: React.FC<EducationLevelFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);
    }else{
      formRef.current?.resetFields();
    }

  }, [props.open, props.values, formRef]);

  const handleSubmit = async (values: EducationLevelFeature.EducationLevelListItem) => {
    try {
      if (props.values) {
        await editEducationLevel(props.values.id, values);
      } else {
        await addEducationLevel(values);
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
      title={props.values != undefined ? "Edit Tingkat Pendidikan" : "Tambah Tingkat Pendidikan"}
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
            message: "EducationLevel Name Is Required",
          },
        ]}
        placeholder="Masukkan Nama Tingkat Pendidikan"
        width="md"
        name="name"
        label="Nama Tingkat Pendidikan"
      />

    </ModalForm>
  );
};

export default EducationLevelForm;
