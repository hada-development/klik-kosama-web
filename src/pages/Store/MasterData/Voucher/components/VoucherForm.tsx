import {
  ModalForm,
  ProFormDatePicker,
  ProFormInstance,
  ProFormMoney,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';

import SearchableSelectInput from '@/common/components/SearchableSelectInput';
import { voucherStatuses } from '@/common/data/data';
import { convertValueEntryToOptions } from '@/common/utils/utils';
import { getMember } from '@/pages/Coop/Member/data/services/service';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { VoucherFeature } from '../data/data';
import { addVoucher, editVoucher } from '../data/services/service';

export type VoucherFormProps = {
  onCancel: (flag?: boolean, formVals?: VoucherFeature.VoucherListItem) => void;
  onSubmit: (values: VoucherFeature.VoucherListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<VoucherFeature.VoucherListItem>;
};

const VoucherForm: React.FC<VoucherFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);
    } else {
      formRef.current?.resetFields();
    }
  }, [props.open, props.values, formRef]);

  const handleSubmit = async (values: VoucherFeature.VoucherListItem) => {
    try {
      if (props.values) {
        await editVoucher(props.values.id, values);
      } else {
        await addVoucher(values);
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
      title={props.values != undefined ? 'Edit Voucher' : 'Tambah Voucher'}
      width="400px"
      formRef={formRef}
      open={props.open}
      onOpenChange={props.setOpen}
      onFinish={async (value) => {
        await handleSubmit(value);
        props.setOpen!(false);
      }}
    >
      <SearchableSelectInput
        rules={[
          {
            required: true,
            message: 'Anggota',
          },
        ]}
        fetchOptions={async (query) =>
          (await getMember({ name: query })).data!.map((e: any) => {
            return { value: e.user_id, label: `${e.member_no} - ${e.name}` };
          })
        }
        placeholder="Pilih Anggota"
        width="md"
        name="user_id"
        label="Anggota"
      />

      <ProFormText
        rules={[
          {
            required: true,
            message: 'Voucher Name Is Required',
          },
        ]}
        placeholder="Masukkan Nama Voucher"
        width="md"
        name="name"
        label="Nama Voucher"
      />

      <ProFormMoney
        placeholder="Masukkan Nominal Voucher"
        width="md"
        locale="id-ID"
        rules={[
          {
            required: true,
            message: 'Wajib',
          },
        ]}
        name="amount"
        label="Nominal Voucher"
      />

      <ProFormDatePicker
        placeholder="Masukkan Tanggal Expired"
        width="md"
        rules={[
          {
            required: true,
            message: 'Wajib',
          },
        ]}
        name="expired_at"
        label="Tanggal Expired"
      />

      <ProFormSelect
        name="status"
        label="Status"
        options={convertValueEntryToOptions(voucherStatuses)}
      />
    </ModalForm>
  );
};

export default VoucherForm;
