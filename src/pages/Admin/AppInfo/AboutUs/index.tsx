import RichTextEditor from '@/common/components/RichTextEditor';
import { markdownToHtml } from '@/common/components/RichTextEditor/MdParser';
import { PageContainer, ProForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { Card, Spin, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { AboutUsType } from '../data/data';
import { getAboutUs, setAboutUs as putAboutUs } from './data/services';

const AppInfoAboutUsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [aboutus, setAboutUs] = useState<AboutUsType | undefined>(undefined);
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    fetchAboutUs();
  }, []);

  function fetchAboutUs() {
    setLoading(true);
    getAboutUs()
      .then((data) => {
        setAboutUs(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function submit(value: any): Promise<void> {
    setLoading(true);
    try {
      await putAboutUs(value);

      message.success('Berhasil mengupdate tentang kosama');
    } catch (e: any) {
      console.log(e);
      message.error(e.response?.data?.message);
    } finally {
      setLoading(false);
    }
    fetchAboutUs();
  }

  return (
    <PageContainer>
      <Spin spinning={loading}>
        <Card>
          {aboutus ? (
            <ProForm initialValues={aboutus} onFinish={submit}>
              <ProForm.Item
                name="about_us"
                label="Tentang Kosama"
                rules={[{ required: true, message: 'Wajib diisi' }]}
              >
                <RichTextEditor initialValue={markdownToHtml(aboutus.about_us)} />
              </ProForm.Item>
              <ProForm.Item
                name="vission_mission"
                label="Visi Misi"
                rules={[{ required: true, message: 'Wajib diisi' }]}
              >
                <RichTextEditor initialValue={markdownToHtml(aboutus.vission_mission)} />
              </ProForm.Item>

              <ProFormText
                name="organization_structure_url"
                disabled
                hidden={true}
                label="Url Organization Structure"
              />
            </ProForm>
          ) : null}
        </Card>
      </Spin>
    </PageContainer>
  );
};

export default AppInfoAboutUsPage;
