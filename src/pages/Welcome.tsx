import { ApartmentOutlined, BarcodeOutlined, TeamOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Access, useAccess, useModel } from '@umijs/max';
import { Card, theme } from 'antd';
import React from 'react';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: string;
  icon?: React.ReactNode;
  index: number;
  desc: string;
  href: string;
}> = ({ title, href, icon, index, desc }) => {
  const { useToken } = theme;

  const { token } = useToken();

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            lineHeight: '40px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            marginBottom: '-8px',
            color: '#FFF',
            fontWeight: 'bold',
            fontSize: '24px',
            backgroundImage:
              "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
          }}
        >
          {icon ?? index}
        </div>
        <div
          style={{
            fontSize: '20px',
            color: token.colorText,
            fontWeight: 'bold',
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          color: token.colorTextSecondary,
          textAlign: 'justify',
          lineHeight: '22px',
          marginBottom: 8,
        }}
      >
        {desc}
      </div>
      <a href={href}>Buka Modul {'>'}</a>
    </div>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const access = useAccess(); // members of access instance: canReadFoo, canUpdateFoo, canDeleteFoo

  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            backgroundImage:
              "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
          }}
        >
          <div
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: token.colorTextHeading,
            }}
          >
            Selamat datang {currentUser?.name}
          </div>
          <p
            style={{
              fontSize: '16px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 8,
              marginBottom: 32,
              width: '65%',
            }}
          >
            Di Sistem Informasi Digital Koperasi Sejahtera Bersama (KOSAMAIP)
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <Access accessible={access.canHris ?? false}>
              <InfoCard
                index={1}
                icon={<TeamOutlined />}
                href="/hris"
                title="Modul HRIS"
                desc="Mengotomatiskan penggajian, merekam absensi, dan mempermudah pengajuan cuti, meningkatkan efisiensi administrasi sumber daya manusia."
              />
            </Access>

            <Access accessible={access.canCoop ?? false}>
              <InfoCard
                index={2}
                icon={<ApartmentOutlined />}
                title="Modul Anggota & Sim-Pin"
                href="/coop"
                desc="Mengelola informasi anggota, transaksi simpan pinjam, dan histori keuangan, mempermudah pengelolaan keuangan koperasi dan pelayanan kepada anggota."
              />
            </Access>

            <Access accessible={access.canStore ?? false}>
              <InfoCard
                index={3}
                icon={<BarcodeOutlined />}
                title="Modul Operasi Toko"
                href="#"
                desc="Mengelola operasi toko secara efisien, termasuk stok produk, penjualan, dan pelaporan, untuk mendukung pertumbuhan usaha dan kepuasan pelanggan."
              />
            </Access>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
