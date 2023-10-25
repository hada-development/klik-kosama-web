import { PageContainer, ProForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { Card, Spin, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { ContactType } from '../data/data';
import { getContact, setContact as putContact } from './data/services';

const AppInfoContactPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState<ContactType | undefined>(undefined);
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    fetchContact();
  }, []);

  function fetchContact() {
    setLoading(true);
    getContact()
      .then((data) => {
        setContact(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function submit(value: any): Promise<void> {
    setLoading(true);
    try {
      await putContact(value);

      message.success('Berhasil mengupdate kontak');
    } catch (e: any) {
      message.error(e);
    } finally {
      setLoading(false);
    }
    fetchContact();
  }

  return (
    <PageContainer>
      <Spin spinning={loading}>
        <Card>
          {contact ? (
            <ProForm initialValues={contact} onFinish={submit}>
              <ProFormText
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Wajib diisi' },
                  { type: 'email', message: 'Format email tidak sesuai' },
                ]}
              />

              <ProFormText
                name="whatsapp"
                label="Whatsapp"
                rules={[
                  { required: true, message: 'Wajib diisi' },
                  { type: 'url', message: 'Format url tidak sesuai' },
                ]}
              />

              <ProFormText
                name="telephone"
                label="Telepon"
                rules={[
                  { required: true, message: 'Wajib diisi' },
                  {
                    validator: (_, value) => {
                      // Define a regular expression pattern for the phone number format
                      const phoneNumberPattern = /^\+62\d{6,13}$/;

                      // Test if the value matches the pattern
                      if (!value || phoneNumberPattern.test(value)) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        'Please enter a valid phone number in the format: +62000000000',
                      );
                    },
                  },
                ]}
              />
            </ProForm>
          ) : null}
        </Card>
      </Spin>
    </PageContainer>
  );
};

export default AppInfoContactPage;
