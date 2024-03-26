import {
  DrawerForm,
  ProForm,
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormUploadDragger,
} from '@ant-design/pro-components';

import { publishStatuses } from '@/common/data/data';
import { storeReport, updateReport } from '@/pages/Coop/Report/data/services';
import { message } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { ReportModel } from '../data/data';

export type ReportFormProp = {
  onCancel: (flag?: boolean, formVals?: ReportModel) => void;
  onSubmit: (values: ReportModel) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<ReportModel>;
};

const ReortForm: React.FC<ReportFormProp> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      let report: any = props.values;
      report.file = props.values.file
        ? [
            {
              uuid: '1',
              name: props.values.file?.name,
              status: 'done',
              url: props.values.file?.address,
            },
          ]
        : null;
      formRef.current?.setFieldsValue(report);
    } else {
      formRef.current?.resetFields();
    }
  }, [props.open, props.values, formRef]);

  const handleSubmit = async (values: any) => {
    try {
      console.log(values);
      if (props.values) {
        await updateReport(props.values!.id!.toString(), values);
      } else {
        await storeReport(values);
      }
      await props.onSubmit(values);
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
      title={props.values !== undefined ? 'Edit Information' : 'Tambah Information'}
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
          placeholder="Masukkan Judul Laporan"
          width="xl"
          name="title"
          label="Judul Laproan"
        />

        <ProFormDigit
          rules={[
            {
              required: true,
              message: 'Mohon masukkan',
            },
          ]}
          placeholder="Masukkan Tahun Laporan"
          width="md"
          name="year"
          label="Tahun Laporan"
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

      <ProFormUploadDragger
        name="file"
        label="Upload File"
        max={1}
        title="Pilih File"
        description="Pilih satu file"
      />
    </DrawerForm>
  );
};

export default ReortForm;
