import {
  ModalForm,
  ProForm,
  ProFormDatePicker,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';

import React, { Dispatch, SetStateAction, useRef, useEffect, useState } from 'react';
import { addAnnouncement, editAnnouncement } from '../data/services/service';
import { getImageUrl } from '@/common/utils/utils';
import { message } from 'antd';
import { ImageUploadPreview } from '@/common/components';

export type AnnouncementFormProps = {
  onCancel: (flag?: boolean, formVals?: AnnouncementFeature.AnnouncementListItem) => void;
  onSubmit: (values: AnnouncementFeature.AnnouncementListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<AnnouncementFeature.AnnouncementListItem>;
};

const AnnouncementForm: React.FC<AnnouncementFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);
    } else {
      formRef.current?.resetFields();
    }

  }, [props.open, props.values, formRef]);

  const handleSubmit = async (values: AnnouncementFeature.AnnouncementListItem) => {
    try {
      var response: any;
      if (props.values) {
        response = await editAnnouncement(props.values.id, values);
      } else {
        response = await addAnnouncement(values);
      }
      if (response.message) {
        message.success(response.message);
      }
      props.onSubmit(values);
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response?.data?.message);
      }
      console.error(error);
    } finally {
      props.onCancel();
    }
  };

  return (
    <ModalForm
      title={props.values != undefined ? "Edit Pengumuman" : "Tambah Pengumuman"}
      width="600px"
      formRef={formRef}
      open={props.open}
      onOpenChange={props.setOpen}
      initialValues={{ title: props.values?.title }}

      onFinish={async (value) => {
        await handleSubmit(value);
        props.setOpen!(false);
      }}
    >
      <ProFormDatePicker
        rules={[
          {
            required: true,
            message: "Announcement Date Is Required",
          },
        ]}
        width={'xl'}
        dataFormat='DD/MM/YYYY'
        placeholder="Masukkan Tanggal Pengumuman"
        name="created_at"
        label="Tanggal"
      />

      <ProFormText
        rules={[
          {
            required: true,
            message: "Announcement Title Is Required",
          },
        ]}
        placeholder="Masukkan Judul Pengumuman"
        name="title"
        label="Judul Pengumuman"
      />

      <ProFormTextArea
        rules={[
          {
            required: true,
            message: "Announcement Description Is Required",
          },
        ]}
        placeholder="Masukkan Isi Pengumuman"
        name="description"
        label="Isi Pengumuman"
      />

      <ProFormSelect
        name="status"
        label="Status"
        valueEnum={{
          published: 'Published',
          draft: 'Draft',
          archive: 'Archive',
        }}
        placeholder="Pilih Status"
        rules={[{ required: true, message: 'Please select status!' }]}
      />

      <ProForm.Item
        name="image"
        label="Image"
      >
        <ImageUploadPreview
          valueUrl={getImageUrl(props.values?.image?.address) || undefined}
        />

      </ProForm.Item>
    </ModalForm>
  );
};

export default AnnouncementForm;
