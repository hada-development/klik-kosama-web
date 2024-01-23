import SearchableSelectInput from '@/common/components/SearchableSelectInput';
import { ProForm, ProFormInstance, ProFormText, ProSkeleton } from '@ant-design/pro-components';
import { useModel, useParams } from '@umijs/max';
import { message } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useRef } from 'react';
import { getBankList } from '../../../data/services/service';

const BankAccountSubPage: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const { fetch, saveData, account, loading } = useModel(
    'Coop.Member.MemberDetail.SubPages.Account.useUserMemberAccount',
  );
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if ((!account || account?.data.id !== memberId) && memberId) {
      fetch(parseInt(memberId!));
    }
  }, [memberId]);

  const handleSave = (memberId: number | string, value: any) => {
    const hide = message.loading('Sedang menyimpan');
    saveData(
      memberId,
      {
        bankAccount: value,
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
      if (account.data.user?.bank_account) {
        const fieldsValue = {
          ...account.data.user?.bank_account,
          bank_id: account.data.user?.bank_account!.bank?.id
            ? {
                value: account.data.user?.bank_account!.bank?.id,
                label: account.data.user?.bank_account!.bank?.name,
              }
            : null,
        };
        // console.log(fieldsValue);
        formRef.current?.setFieldsValue(fieldsValue);
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
        <Title level={5}>Akun Bank</Title>

        <ProForm.Group>
          <SearchableSelectInput
            name="bank_id"
            label="Bank"
            placeholder="Cari Bank (Ketik Minimal 3 Huruf)"
            rules={[{ required: true, message: 'Mohon pilih bank' }]}
            fetchOptions={async (query) =>
              (await getBankList(query)).data!.map((e: any) => {
                return { value: e.id, label: e.name };
              })
            }
          />

          <ProFormText
            width={'md'}
            name="account_number"
            label="Nomor Rekening"
            placeholder="Masukkan Nomor Rekening"
            rules={[{ required: true, message: 'Mohon masukkan nomor rekening' }]}
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormText
            width={'md'}
            name="account_name"
            label="Atas Nama Pemegang Rekening"
            placeholder="Masukkan Atas Nama Rekening"
            rules={[{ required: true, message: 'Mohon masukkan atas nama rekening' }]}
          />

          <ProFormText
            width={'md'}
            name="branch_name"
            label="Cabang Rekening"
            placeholder="Masukkan Cabang Rekening"
          />
        </ProForm.Group>
      </ProForm>
    </>
  );
};

export default BankAccountSubPage;
