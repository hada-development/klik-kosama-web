import { ProForm, ProFormInstance, ProFormText, ProSkeleton } from '@ant-design/pro-components';
import { useModel, useParams } from '@umijs/max';
import { Col, Divider, Row, Space, message } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useRef } from 'react';
import ProfilePictureUploader from './components/ProfilePictureUploader';

const AccountSubPage: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { fetch, saveData, account, loading } = useModel(
    'HRIS.Employee.EmployeeDetail.SubPages.Account.useUserEmployeeAccount',
  );
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if ((!account || account?.data.id !== employeeId) && employeeId) {
      fetch(parseInt(employeeId));
    }
  }, [employeeId]);

  const handleSave = (employeeId: number | string, value: any) => {
    const hide = message.loading('Sedang menyimpan');
    saveData(
      employeeId!,
      {
        user: value,
      },
      account?.data.user_id,
    )
      .then(() => {
        hide();
        message.success('Berhasil menyimpan data');
      })
      .catch((e) => {
        console.log(e.response?.response?.data);
      })
      .finally(() => {});
  };

  useEffect(() => {
    if (account) {
      if (account) {
        formRef.current?.setFieldsValue(account.data.user!);
      }
    }
  }, [account]);

  if (loading) return <ProSkeleton />;
  return (
    <>
      <Row>
        <Col flex={2}>
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
            <Title level={5}>Informasi Akun</Title>

            <ProFormText
              name="name"
              label="Nama"
              rules={[
                {
                  required: true,
                  message: 'Nama wajib diisi',
                },
              ]}
            />

            <ProFormText
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: 'Email wajib diisi',
                },
                {
                  type: 'email',
                  message: 'Masukkan email yang benar',
                },
              ]}
            />

            <Divider />
            <Title level={5}>Password</Title>
            <p>Kosongkan jika tidak ada perubahan</p>
            <ProFormText.Password name="password" label="Password" />
            <ProFormText.Password
              dependencies={['password']}
              name="password_confirmation"
              label="Konfirmasi Password"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Password tidak sama!'));
                  },
                }),
              ]}
            />
          </ProForm>
        </Col>
        <Col flex={3}>
          <Space
            direction="vertical"
            size="middle"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
          >
            <Title level={5}>Foto Profil</Title>
            {account && <ProfilePictureUploader user_id={account.data.user_id!} />}
          </Space>
        </Col>
      </Row>
    </>
  );
};

export default AccountSubPage;
