import {
  ModalForm,
  ProFormDatePicker,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';

import { eventTypes, publishStatuses } from '@/common/data/data';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { addEvent, editEvent } from '../data/services/service';

export type EventFormProps = {
  onCancel: (flag?: boolean, formVals?: EventFeature.EventListItem) => void;
  onSubmit: (values: EventFeature.EventListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<EventFeature.EventListItem>;
};

const EventForm: React.FC<EventFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);
    } else {
      formRef.current?.resetFields();
    }
  }, [props.open, props.values, formRef]);

  const handleSubmit = async (values: EventFeature.EventListItem) => {
    try {
      if (props.values) {
        await editEvent(props.values.id, values);
      } else {
        await addEvent(values);
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
      title={props.values != undefined ? 'Edit Event' : 'Tambah Event'}
      width="400px"
      formRef={formRef}
      open={props.open}
      onOpenChange={props.setOpen}
      onFinish={async (value) => {
        await handleSubmit(value);
        props.setOpen!(false);
      }}
    >
      <ProFormDatePicker placeholder="Tanggal" width="md" name="date" label="Tanggal" />

      <ProFormText
        rules={[
          {
            required: true,
          },
        ]}
        placeholder="Masukkan Nama Hari Libur"
        width="md"
        name="title"
        label="Nama Hari Libur"
      />

      <ProFormText
        placeholder="Masukkan Keterangan / catatan"
        width="md"
        name="description"
        label="Keterangan"
      />

      <ProFormSelect
        name="type"
        label="Jenis Acara"
        valueEnum={eventTypes}
        placeholder="Pilih Jenis Acara"
        rules={[{ required: true, message: 'Please select Jenis Acara!' }]}
      />

      <ProFormSelect
        name="status"
        label="Status"
        valueEnum={publishStatuses}
        placeholder="Pilih Status"
        rules={[{ required: true, message: 'Please select status!' }]}
      />
    </ModalForm>
  );
};

export default EventForm;
