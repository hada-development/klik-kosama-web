import { ImageUploadPreview } from '@/common/components';
import { PageContainer, ProForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { Card, Divider, Spin, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { OrganizationPersonType, OrganizationStructureType } from '../data/data';
import {
  getOrganizationStructure,
  setOrganizationStructure as putOrganizationStructure,
} from './data/services';

import { Typography } from 'antd';

const { Title } = Typography;

const AppInfoOrganizationStructurePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [organizationstructure, setOrganizationStructure] = useState<
    OrganizationStructureType | undefined
  >(undefined);
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    fetchOrganizationStructure();
  }, []);

  function fetchOrganizationStructure() {
    setLoading(true);
    getOrganizationStructure()
      .then((data) => {
        console.log(data);
        setOrganizationStructure(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function submit(value: any): Promise<void> {
    setLoading(true);
    try {
      await putOrganizationStructure(value);
      message.success('Berhasil mengupdate kontak');
    } catch (e: any) {
      console.log(e);
    } finally {
      setLoading(false);
    }
    fetchOrganizationStructure();
  }

  return (
    <PageContainer>
      <Spin spinning={loading}>
        <Card>
          <ProForm onFinish={submit}>
            <Title level={3}>Pengurus</Title>
            {organizationstructure && (
              <ProFormText
                name="management_title"
                placeholder={'Judul Pengurus'}
                initialValue={organizationstructure?.management_title}
              />
            )}
            <div
              style={{
                display: 'flex',
                gap: '12px',
              }}
            >
              {organizationstructure?.management.map((person) => (
                <ManagerCard type="management" key={person.order} person={person} />
              ))}
            </div>
            <Divider />

            <Title level={3}>Pengawas</Title>
            {organizationstructure && (
              <ProFormText
                name="supervisor_title"
                placeholder={'Judul Pengawas'}
                initialValue={organizationstructure?.supervisor_title}
              />
            )}
            <div
              style={{
                display: 'flex',
                gap: '12px',
              }}
            >
              {organizationstructure?.supervisor.map((person) => (
                <ManagerCard type="supervisor" key={person.order} person={person} />
              ))}
            </div>

            <Divider />
            <Title level={3}>Pembina</Title>
            {organizationstructure && (
              <ProFormText
                name="coach_title"
                placeholder={'Judul Pembina'}
                initialValue={organizationstructure?.coach_title}
              />
            )}
            <div
              style={{
                display: 'flex',
                gap: '12px',
              }}
            >
              {organizationstructure?.coach.map((person) => (
                <ManagerCard type="coach" key={person.order} person={person} />
              ))}
            </div>
          </ProForm>
        </Card>
      </Spin>
    </PageContainer>
  );
};

export default AppInfoOrganizationStructurePage;
interface PersonCardProps {
  type: string;
  person: OrganizationPersonType;
}

function ManagerCard(prop: PersonCardProps) {
  return (
    <Card style={{ width: '100%' }}>
      <ProForm.Item name={[prop.type, prop.person.order, 'image']}>
        <ImageUploadPreview
          width={`${232 * 0.6}px`}
          height={`${359 * 0.6}px`}
          valueUrl={prop.person.image_url}
        />
      </ProForm.Item>
      <ProFormText
        name={[prop.type, prop.person.order, 'image_url']}
        label="Hidden Field"
        hidden={true}
        initialValue={prop.person.image_url}
      />
      <ProFormText
        name={[prop.type, prop.person.order, 'order']}
        label="Hidden Field"
        hidden={true}
        initialValue={prop.person.order}
      />

      <ProFormText
        label="Nama"
        name={[prop.type, prop.person.order, 'name']}
        initialValue={prop.person.name}
      />
      <ProFormText
        label="Jabatan"
        name={[prop.type, prop.person.order, 'title']}
        initialValue={prop.person.title}
      />
    </Card>
  );
}
