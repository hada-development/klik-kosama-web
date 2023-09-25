import { ModalForm, ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-components';

import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { getPositionLevel } from '../../PositionLevel/data/services/service';
import { addPosition, editPosition } from '../data/services/service';

export type PositionFormProps = {
  onCancel: (flag?: boolean, formVals?: PositionFeature.PositionListItem) => void;
  onSubmit: (values: PositionFeature.PositionListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<PositionFeature.PositionListItem>;
};

const PositionForm: React.FC<PositionFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);
    } else {
      formRef.current?.resetFields();
    }
  }, [props.open, props.values, formRef]);

  const handleSubmit = async (values: PositionFeature.PositionListItem) => {
    try {
      if (props.values) {
        await editPosition(props.values.id, values);
      } else {
        await addPosition(values);
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
      <ProFormSelect
        width="md"
        name="hr_position_level_id"
        label="Jenis Pegawai"
        placeholder="Pilih Jenis Pegawai"
        request={async () =>
          (await getPositionLevel({})).data.map((e: any) => {
            return { value: e.id, label: e.name };
          })
        }
        rules={[{ required: true, message: 'Level Jabatan' }]}
      />

      <ProFormText
        rules={[
          {
            required: true,
            message: 'Position Name Is Required',
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

export default PositionForm;
