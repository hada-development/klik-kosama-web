import {
  DrawerForm,
  ProFormDigit,
  ProFormInstance,
  ProFormMoney,
} from '@ant-design/pro-components';

import SearchableSelectInput from '@/common/components/SearchableSelectInput';
import { getMember } from '@/pages/Coop/Member/data/services/service';
import { MemberShu } from '@/pages/Coop/Shu/MemberShu/data/data';
import confirm from 'antd/es/modal/confirm';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { addMemberShu, editMemberShu } from '../data/services/service';

export type MemberShuFormProps = {
  onCancel: (flag?: boolean, formVals?: LeaveTypeFeature.LeaveTypeListItem) => void;
  onSubmit: (values: MemberShu) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<MemberShu>;
};

const MemberShuForm: React.FC<MemberShuFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);
    } else {
      formRef.current?.resetFields();
    }
  }, [props.open, props.values, formRef]);

  const handleSubmit = async (values: MemberShu) => {
    try {
      if (props.values) {
        await editMemberShu(props.values.id, values);
      } else {
        await addMemberShu(values);
      }
      props.onSubmit(values);
    } catch (error) {
      console.error(error);
    } finally {
      props.onCancel();
    }
  };

  const confirmSubmit = async (value: any) => {
    return new Promise<boolean>((resolve) => {
      confirm({
        title: 'Data sudah benar?',
        content: 'Anda yakin data yang anda masukkan sudah benar?',
        cancelText: 'Batalkan',
        closable: true,
        okCancel: true,
        okText: 'Simpan',
        onOk: async () => {
          await handleSubmit(value);
          resolve(true);
        },
        onCancel: () => {
          resolve(false);
        },
      });
    });
  };

  return (
    <DrawerForm
      title={props.values !== undefined ? 'Edit SHU Anggota' : 'Tambah SHU Anggota'}
      width="400px"
      formRef={formRef}
      open={props.open}
      onOpenChange={props.setOpen}
      onFinish={confirmSubmit}
    >
      <SearchableSelectInput
        name="member_id"
        label="Pilih Angota"
        placeholder="Cari Anggota (Ketik Minimal 3 Huruf)"
        fetchOptions={async (query) =>
          (await getMember({ name: query })).data!.map((e: any) => {
            return { value: e.id, label: `${e.member_no} - ${e.name}` };
          })
        }
        rules={[
          {
            required: true,
            message: 'Anggota Is Required',
          },
        ]}
      />

      <ProFormDigit
        rules={[
          {
            required: true,
            message: 'Tahun SHU Required',
          },
        ]}
        placeholder="Masukkan Tahun SHU"
        width="md"
        name="year"
        label="Tahun SHU"
      />

      <ProFormMoney
        rules={[
          {
            required: true,
            message: 'Total SHU Required',
          },
        ]}
        customSymbol="Rp"
        placeholder="Masukkan Total SHU"
        width="md"
        name="total_shu"
        label="Total SHU"
      />

      <ProFormMoney
        rules={[
          {
            required: true,
            message: 'Kompensasi Kehadiran Required',
          },
        ]}
        customSymbol="Rp"
        placeholder="Masukkan Kompensasi Kehadiran"
        width="md"
        name="attendance_fee"
        label="Kompensasi Kehadiran"
      />

      <ProFormMoney
        rules={[
          {
            required: true,
            message: 'Kompensasi Pemilihan Required',
          },
        ]}
        customSymbol="Rp"
        placeholder="Masukkan Kompensasi Pemilihan"
        width="md"
        name="vote_fee"
        label="Kompensasi Pemilihan"
      />

      <ProFormMoney
        rules={[
          {
            required: true,
            message: 'SHU Dibagikan Required',
          },
        ]}
        customSymbol="Rp"
        placeholder="Masukkan SHU Dibagikan"
        width="md"
        name="paid_shu"
        label="SHU Dibagikan"
      />

      <ProFormMoney
        rules={[
          {
            required: true,
            message: 'SHU Disimpan Required',
          },
        ]}
        customSymbol="Rp"
        placeholder="Masukkan SHU Disimpan"
        width="md"
        name="saved_shu"
        label="SHU Disimpan"
      />
    </DrawerForm>
  );
};

export default MemberShuForm;
