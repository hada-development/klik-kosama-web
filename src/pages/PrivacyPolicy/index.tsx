// src/pages/PrivacyPolicy.tsx

import { Helmet } from '@umijs/max';
import { Card, Divider, Typography } from 'antd';
import React from 'react';

const { Title, Paragraph } = Typography;

const PrivacyPolicy: React.FC = () => {
  return (
    <div>
      <Helmet>
        <title>Kebijakan Privasi - KKC Mobile</title>
        <meta name="description" content="Kebijakan Privasi untuk Aplikasi KKC Mobile" />
      </Helmet>
      <Card>
        <Title level={2}>Kebijakan Privasi</Title>
        <Paragraph>
          Selamat datang di KKC Mobile, aplikasi digital untuk Koperasi Pegawai Cogindo. Aplikasi
          ini dikembangkan dan dikelola oleh Koperasi Pegawai Cogindo (KKC).
        </Paragraph>
        <Paragraph>
          Kebijakan Privasi ini menjelaskan bagaimana informasi pribadi Anda dikumpulkan, digunakan,
          dan diungkapkan oleh KKC Mobile.
        </Paragraph>

        {/* Informasi yang Kami Kumpulkan */}
        <Divider orientation="left">Informasi yang Kami Kumpulkan</Divider>
        <Paragraph>
          <strong>Informasi Pribadi:</strong> Kami dapat mengumpulkan informasi pribadi seperti
          nama, alamat, dan informasi kontak yang Anda berikan saat menggunakan aplikasi.
        </Paragraph>
        <Paragraph>
          <strong>Informasi Perangkat:</strong> Kami dapat mengumpulkan informasi perangkat seperti
          jenis perangkat, sistem operasi, dan unik identifier perangkat untuk tujuan analisis dan
          perbaikan aplikasi.
        </Paragraph>

        {/* Bagaimana Kami Menggunakan Informasi Anda */}
        <Divider orientation="left">Bagaimana Kami Menggunakan Informasi Anda</Divider>
        <Paragraph>
          - Kami menggunakan informasi yang dikumpulkan untuk menyediakan layanan dan fitur
          aplikasi.
        </Paragraph>
        <Paragraph>
          - Informasi perangkat digunakan untuk analisis statistik dan pemahaman penggunaan
          aplikasi.
        </Paragraph>

        {/* Pemberian Informasi ke Pihak Ketiga */}
        <Divider orientation="left">Pemberian Informasi ke Pihak Ketiga</Divider>
        <Paragraph>
          - Kami tidak menjual atau menyewakan informasi pribadi pengguna kepada pihak ketiga.
        </Paragraph>
        <Paragraph>
          - Informasi dapat dibagikan dengan penyedia layanan pihak ketiga untuk mendukung
          pengoperasian dan fungsionalitas aplikasi.
        </Paragraph>

        {/* Keamanan */}
        <Divider orientation="left">Keamanan</Divider>
        <Paragraph>
          - Kami menjaga keamanan informasi pengguna dengan menerapkan langkah-langkah keamanan yang
          sesuai.
        </Paragraph>

        {/* Perubahan pada Kebijakan Privasi */}
        <Divider orientation="left">Perubahan pada Kebijakan Privasi</Divider>
        <Paragraph>
          - Kebijakan Privasi ini dapat diperbarui dari waktu ke waktu. Setiap perubahan akan
          diinformasikan melalui pembaruan aplikasi atau situs web kami.
        </Paragraph>

        {/* Kontak */}
        <Divider orientation="left">Kontak</Divider>
        <Paragraph>
          - Jika Anda memiliki pertanyaan atau komentar tentang Kebijakan Privasi ini, hubungi kami
          di <a href="mailto:admin@kkc.co.id">admin@kkc.co.id</a>.
        </Paragraph>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
