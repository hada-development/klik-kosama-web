import { convertValueEntryToOptions } from '@/common/utils/utils';
import {
  ProForm,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProSkeleton,
} from '@ant-design/pro-components';
import { useModel, useParams } from '@umijs/max';
import { message } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useRef } from 'react';
import { memberStatus, memberType } from '../../../data/data';

const MemberDataSubPage: React.FC = () => {
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
    console.log(value);
    saveData(memberId!, {
      ...value,
    })
      .then(() => {
        message.success('Berhasil menyimpan data');
      })
      .catch((e: any) => {
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
        formRef.current?.setFieldsValue({ ...account.data });
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
        <Title level={5}>Informasi Keanggotaan</Title>

        <ProForm.Group>
          <ProFormText
            width="md"
            name="member_no"
            label="Nomor Anggota"
            placeholder="Masukkan Nomor Anggota"
            rules={[
              {
                required: true,
                message: 'Nomor Anggota wajib diisi',
              },
            ]}
          />

          <ProFormSelect
            width="md"
            name="type"
            label="Jenis Anggota"
            placeholder="Jenis Anggota"
            options={convertValueEntryToOptions(memberType)}
          />

          <ProFormSelect
            width="md"
            name="status"
            label="Status Anggota"
            placeholder="Status Anggota"
            options={convertValueEntryToOptions(memberStatus)}
          />
        </ProForm.Group>
      </ProForm>
    </>
  );
};

export default MemberDataSubPage;
