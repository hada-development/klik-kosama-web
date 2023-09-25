import SearchableSelectInput from '@/common/components/SearchableSelectInput';
import { ProForm, ProFormInstance, ProFormText, ProSkeleton } from '@ant-design/pro-components';
import { useModel, useParams } from '@umijs/max';
import { message } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useRef } from 'react';
import { getBankList } from '../../../data/services/service';

const BankAccountSubPage: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { fetch, saveData, account, loading } = useModel(
    'HRIS.Employee.EmployeeDetail.SubPages.Account.useUserEmployeeAccount',
  );
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if ((!account || account?.data.id != employeeId) && employeeId) {
      fetch(parseInt(employeeId!));
    }
  }, [employeeId]);

  const handleSave = (employeeId: number | string, value: any) => {
    const hide = message.loading('Sedang menyimpan');
    saveData(
      employeeId,
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
        formRef.current?.setFieldsValue({
          ...account.data.user?.bank_account,
          bank_id: account.data.user?.bank_account!.bank?.id
            ? {
                value: account.data.user?.bank_account!.bank?.id,
                label: account.data.user?.bank_account!.bank?.name,
              }
            : null,
        });
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
          handleSave(employeeId!, value);
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
