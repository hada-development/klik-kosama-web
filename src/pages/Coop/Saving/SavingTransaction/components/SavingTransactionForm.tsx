import {
  DrawerForm,
  ProFormDatePicker,
  ProFormInstance,
  ProFormMoney,
  ProFormSelect,
} from '@ant-design/pro-components';

import SearchableSelectInput from '@/common/components/SearchableSelectInput';
import { convertValueEntryToOptions } from '@/common/utils/utils';
import { getMember } from '@/pages/Coop/Member/data/services/service';
import { message } from 'antd';
import confirm from 'antd/es/modal/confirm';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { savingTypes, transactionTypes } from '../../data/data';
import { addSavingTransaction, editSavingTransaction } from '../data/services/service';

export type SavingTransactionFormProps = {
  onCancel: (flag?: boolean, formVals?: SavingTransactionFeature.SavingTransactionListItem) => void;
  onSubmit: (values: SavingTransactionFeature.SavingTransactionListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<SavingTransactionFeature.SavingTransactionListItem>;
};

const SavingTransactionForm: React.FC<SavingTransactionFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);
    } else {
      formRef.current?.resetFields();
    }
  }, [props.open, props.values, formRef]);

  const confirmSubmit = async (value: any) => {
    return new Promise<boolean>((resolve, reject) => {
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

  const handleSubmit = async (values: SavingTransactionFeature.SavingTransactionListItem) => {
    try {
      if (props.values) {
        await editSavingTransaction(props.values.id, values);
      } else {
        await addSavingTransaction(values);
      }
      props.onSubmit(values);
      return true;
    } catch (e: any) {
      console.error(e);
      if (e.response?.data?.message) {
        if (e.response?.data?.errors) {
          Object.values(e.response!.data!.errors).forEach((value: any) => {
            message.error(value[0]);
          });
        } else {
          message.error(e.response?.data?.message);
        }
      }
      return false;
    }
  };

  return (
    <DrawerForm
      title={props.values != undefined ? 'Edit Jenis Pegawai' : 'Tambah Jenis Pegawai'}
      width="500px"
      formRef={formRef}
      open={props.open}
      onOpenChange={props.setOpen}
      onFinish={confirmSubmit}
    >
      <SearchableSelectInput
        name="member_id"
        label="Pilih Angota"
        placeholder="Cari Karyawan (Ketik Minimal 3 Huruf)"
        fetchOptions={async (query) =>
          (await getMember({ name: query })).data!.map((e: any) => {
            return { value: e.id, label: `${e.member_no} - ${e.name}` };
          })
        }
        rules={[
          {
            required: true,
            message: 'SavingTransaction Name Is Required',
          },
        ]}
      />

      <ProFormSelect
        name="saving_type"
        width={'md'}
        label="Jenis Simpanan"
        options={convertValueEntryToOptions(savingTypes)}
        rules={[
          {
            required: true,
            message: 'Jenis Simpanan Is Required',
          },
        ]}
      />

      <ProFormSelect
        name="transaction_type"
        width={'md'}
        label="Jenis Transaksi"
        options={convertValueEntryToOptions(transactionTypes)}
        rules={[
          {
            required: true,
            message: 'Jenis Transaksi Is Required',
          },
        ]}
      />

      <ProFormMoney
        rules={[
          {
            required: true,
            message: 'Nominal Is Required',
          },
        ]}
        customSymbol="Rp"
        placeholder="Masukkan Nominal"
        width="md"
        name="amount"
        label="Nominal Simpanan"
      />

      <ProFormDatePicker
        rules={[
          {
            required: true,
            message: 'Tanggal Is Required',
          },
        ]}
        placeholder="Masukkan Tanggal"
        width="md"
        name="created_at"
        label="Tanggal Simpanan"
      />
    </DrawerForm>
  );
};

export default SavingTransactionForm;
