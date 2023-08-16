import React, { useEffect } from 'react';
import { Outlet, useParams, history } from "umi";
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from "antd";
import Item from "antd/lib/list/Item";
import { MenuDataItem, PageContainer, ProLayoutProps, Settings } from "@ant-design/pro-components";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";

export type EmployeeDetailLayoutProps = {
    breadcrumbNameMap: Record<string, MenuDataItem>;
    route: ProLayoutProps['route'] & {
        authority: string[];
    };
    settings: Settings;
} & ProLayoutProps;

export type EmployeeDetailLayoutContext = { [K in 'location']: EmployeeDetailLayoutProps[K] } & {
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
    getItem('Data Pegawai', 'employee-data'),
    getItem('Informasi Personal', 'personal-data'),
    getItem('Akun Bank', 'bank-account'),
];

const EmployeeDetailLayout: React.FC<EmployeeDetailLayoutProps> = (props) => {

    const { employeeId } = useParams<{ employeeId: string }>();

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const onClick: MenuProps['onClick'] = (e) => {
        const key = e.key;
        history.push(key);
    };

    useEffect(() => {
        if (employeeId == "2") {
            history.push('404');
        }
    }, [employeeId]);

    return (
        <PageContainer>
            <Layout style={{ padding: '0', background: colorBgContainer }}>

                <Menu
                    onClick={onClick}
                    style={{ height: "100%" }}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="horizontal"
                    items={items}
                />


                <Content style={{ padding: '24px 24px', minHeight: 280 }}>
                    {employeeId}
                    <Outlet />
                </Content>

            </Layout>
        </PageContainer>
    );
}

export default EmployeeDetailLayout;


