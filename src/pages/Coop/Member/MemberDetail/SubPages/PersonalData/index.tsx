import {
  ProForm,
  ProFormDatePicker,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProSkeleton,
} from '@ant-design/pro-components';
import { useModel, useParams } from '@umijs/max';
import { message } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useRef } from 'react';
import { genders, maritalStatuses, religions } from '../../../data/data';

const PersonalDataSubPage: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const { fetch, saveData, account, loading } = useModel(
    'Coop.Member.MemberDetail.SubPages.Account.useUserMemberAccount',
  );
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if ((!account || account?.data.id != memberId) && memberId) {
      fetch(parseInt(memberId!));
    }
  }, [memberId]);

  const handleSave = (memberId: number | string, value: any) => {
    const hide = message.loading('Sedang menyimpan');
    saveData(
      memberId,
      {
        personalData: value,
      },
      account!.data.user!.id!,
    )
      .then(() => {
        message.success('Berhasil menyimpan data');
      })
      .catch((e) => {
        console.log(e);
        console.log(e.response?.response?.data);
      })
      .finally(() => {
        hide();
      });
  };

  useEffect(() => {
    if (account) {
      if (account) {
        formRef.current?.setFieldsValue({ ...account.data.user?.personal_data });
      }
    }
  }, [account]);

  if (loading) return <ProSkeleton />;
  return (
    <>
      <ProForm
        submitter={{
          searchConfig: {
            submitText: 'Simpan Perubahan', // Change the submit button text
          },
          resetButtonProps: { style: { display: 'none' } }, //
        }}
        formRef={formRef}
        onFinish={async (value) => {
          handleSave(memberId!, value);
          return true;
        }}
        disabled={loading}
      >
        <Title level={5}>Informasi Personal</Title>

        <ProForm.Group>
          <ProFormText width="md" name="nik" label="NIK" placeholder="Masukkan NIK" />
          <ProFormText width="md" name="npwp" label="NPWP" placeholder="Masukkan NPWP" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="md"
            name="birth_place"
            label="Tempat Lahir"
            placeholder="Masukkan Tempat Lahir"
          />
          <ProFormDatePicker
            width="md"
            name="birth_date"
            label="Tanggal Lahir"
            placeholder="Masukkan Lahir"
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormSelect
            width="md"
            name="gender"
            label="Jenis Kelamin"
            placeholder="Pilih Jenis Kelamin"
            options={genders}
            fieldProps={{
              showSearch: true,
            }}
          />
          <ProFormSelect
            width="md"
            name="religion"
            label="Agama"
            placeholder="Agama"
            options={religions}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            width="md"
            name="marital_status"
            label="Status Pernikahan"
            placeholder="Status Pernikahan"
            options={maritalStatuses}
          />

          <ProFormText
            width="md"
            name="phone_number"
            label="Nomor Telepon"
            placeholder="Masukkan Nomor Telepon"
          />
        </ProForm.Group>

        <ProFormTextArea name="address" label="Alamat" placeholder="Masukkan Alamat" />
      </ProForm>
    </>
  );
};

export default PersonalDataSubPage;
