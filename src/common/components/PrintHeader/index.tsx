import Title from 'antd/lib/typography/Title';
import React from 'react';
import logo from '../../../../assets/logo.png';

const PrintHeader: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div
      className="show-on-print print-header"
      style={{
        flexDirection: 'column',
        paddingTop: '20px',
        paddingBottom: '10px',
        justifyContent: 'center',
      }}
    >
      <div className="kop">
        <img src={logo} alt="icon" />

        <div className="title">
          <h1>KOPERASI SEJAHTERA BERSAMA "KOSAMA"</h1>
          <h1>PT. PLN INDONESIA POWER KANTOR PUSAT</h1>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          paddingTop: '10px',
          paddingBottom: '10px',
          justifyContent: 'center',
        }}
      >
        <Title level={5}>{title}</Title>
      </div>
    </div>
  );
};

export default PrintHeader;
