import {
  DrawerForm,
  ProForm,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';

import { ImageUploadPreview } from '@/common/components';
import RichTextEditor from '@/common/components/RichTextEditor';
import { publishStatuses } from '@/common/data/data';
import { getImageUrl } from '@/common/utils/utils';
import { message } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { InformationTableItem } from '../data/data';
import { addInformation, editInformation } from '../data/services/service';

export type InformationFormProps = {
  onCancel: (flag?: boolean, formVals?: InformationTableItem) => void;
  onSubmit: (values: InformationTableItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<InformationTableItem>;
};

const InformationForm: React.FC<InformationFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);
    } else {
      formRef.current?.resetFields();
    }
  }, [props.open, props.values, formRef]);

  const handleSubmit = async (values: InformationTableItem) => {
    try {
      if (props.values) {
        await editInformation(props.values.id, values);
      } else {
        await addInformation(values);
      }
      props.onSubmit(values);
      props.setOpen!(false);
    } catch (error: any) {
      console.error(error);
      if (error?.response) {
        if (error?.response.data.errors) {
          Object.values(error?.response.data.errors).forEach((e: any) => {
            message.error(e);
          });
        }
      }
    } finally {
      // props.onCancel();
    }
  };

  return (
    <DrawerForm
      title={props.values != undefined ? 'Edit Information' : 'Tambah Information'}
      width="760px"
      formRef={formRef}
      open={props.open}
      onOpenChange={props.setOpen}
      onFinish={async (value) => {
        await handleSubmit(value);
      }}
    >
      <ProForm.Group>
        <ProFormText
          rules={[
            {
              required: true,
              message: 'Mohon masukkan',
            },
          ]}
          placeholder="Masukkan Judul Informasi"
          width="lg"
          name="title"
          label="Judul Informasi"
        />

        <ProFormSelect
          name="status"
          label="Status"
          width="sm"
          valueEnum={publishStatuses}
          placeholder="Pilih Status"
          rules={[{ required: true, message: 'Please select status!' }]}
        />
      </ProForm.Group>

      <ProForm.Item
        rules={[
          {
            required: true,
            message: 'Mohon masukkan isi',
          },
        ]}
        label="Isi Informasi"
        name="content"
      >
        <RichTextEditor initialValue={props?.values?.content} />
      </ProForm.Item>

      <ProForm.Item
        rules={[
          {
            required: true,
            message: 'Mohon pilih gambar',
          },
        ]}
        name="image"
        label="Image"
        style={{ width: '200px', height: '200px' }}
      >
        <ImageUploadPreview
          height={'200px'}
          width={'200px'}
          valueUrl={getImageUrl(props.values?.image?.address) || undefined}
        />
      </ProForm.Item>
    </DrawerForm>
  );
};

export default InformationForm;
