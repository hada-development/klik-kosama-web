import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { MenuDataItem, PageContainer, ProLayoutProps, Settings } from '@ant-design/pro-components';
import { Button, Layout, Menu, MenuProps, Modal, message, theme } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import React from 'react';
import { Outlet, history, useModel, useParams } from 'umi';
import { deleteMember } from '../data/services/service';

export type MemberDetailLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
} & ProLayoutProps;

export type MemberDetailLayoutContext = { [K in 'location']: MemberDetailLayoutProps[K] } & {
  breadcrumbNameMap: Record<string, MenuDataItem>;
};

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map((item) => {
    return {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
  });

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps['items'] = [
  getItem('Akun', 'account'),
  getItem('Data Anggota', 'member-data'),
  getItem('Informasi Personal', 'personal-data'),
  getItem('Akun Bank', 'bank-account'),
];

export function getLastPart() {
  const parts = window.location.href.split('/');
  let lastPart = parts[parts.length - 1];
  if (lastPart.length == 0) {
    return parts[parts.length - 2];
  }
  return lastPart;
}

const MemberDetailLayout: React.FC<MemberDetailLayoutProps> = (props) => {
  const { memberId } = useParams<{ memberId: string }>();
  const { account } = useModel('Coop.Member.MemberDetail.SubPages.Account.useUserMemberAccount');
  const [{ confirm }, contextHolder] = Modal.useModal();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onClick: MenuProps['onClick'] = (e) => {
    const key = e.key;
    history.push(`/coop/member/${memberId}/${key}`);
  };

  const handleDelete = () => {
    confirm({
      title: 'Anda yakin ingin menghapus data anggota ini?',
      icon: <ExclamationCircleFilled />,
      content: 'Data yang dihapus tidak dapat dikembalikan',
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batalkan',
      onOk: async () => {
        const hide = message.loading('Mohon Tunggu');
        try {
          await deleteMember(memberId!);
          hide();
          history.replace('/coop/member');
          message.success('Berhasil Menghapus Anggota');
        } catch (e) {
          hide();
          message.error('Tidak bisa menghapus pegawai, karena memiliki simpanan dan pinjaman');
        }
      },
      onCancel: () => {
        console.log('NO');
      },
    });
  };

  return (
    <PageContainer
      header={{
        title: 'Data Anggota' + (account ? ' - ' + account.data.user?.name : ''),
        extra: [
          <Button key={'member-delete-btn'} type="primary" onClick={handleDelete} danger={true}>
            <DeleteOutlined /> Hapus Data Anggota
          </Button>,
        ],
      }}
    >
      {contextHolder}
      <Layout style={{ padding: '0', background: colorBgContainer }}>
        <Sider>
          <Menu
            onClick={onClick}
            style={{ height: '100%' }}
            defaultSelectedKeys={[getLastPart() || 'account']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
          />
        </Sider>
        <Content style={{ padding: '24px 24px', minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </PageContainer>
  );
};

export default MemberDetailLayout;
