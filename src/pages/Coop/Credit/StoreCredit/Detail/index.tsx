import PrintHeader from '@/common/components/PrintHeader';
import { formatDateTime, formatRupiah, isoDateFormat } from '@/common/utils/utils';
import { PrinterOutlined } from '@ant-design/icons';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Button, Card, Divider } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { history, useParams } from 'umi';
import PaymentList from '../../component/PaymentList';
import { CreditStatuses, StoreCreditDetail } from '../data/data';
import { getStoreCreditDetail } from '../data/service';

const StoreCreditListPage: React.FC = () => {
  const { parameter } = useParams<{ parameter: string }>();
  const [detail, setDetail] = useState<StoreCreditDetail | undefined>(undefined);
  const printableRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printableRef.current!,
  });

  useEffect(() => {
    if (parameter != null) {
      getData(parseInt(parameter));
    }
  }, [parameter]);

  const getData = (id: number) => {
    setDetail(undefined);
    getStoreCreditDetail(id)
      .then((value) => {
        setDetail(value.data);
      })
      .catch((e) => {
        console.log(e);
        if (e.response?.status == 404) {
          history.push('/not-found');
        }
      });
  };

  return (
    <PageContainer
      header={{
        title: `Kredit Barang - ${detail?.credit_no ?? ''} `,
        extra: (
          <Button onClick={handlePrint}>
            <PrinterOutlined /> Cetak Halaman
          </Button>
        ),
      }}
    >
      <div className="printable-area" ref={printableRef}>
        <PrintHeader title="KREDIT BARANG" />
        <Card loading={detail == undefined}>
          <ProDescriptions dataSource={detail} column={2}>
            <ProDescriptions.Item
              key={0}
              label="No. Pengajuan"
              dataIndex={['credit_no']}
            ></ProDescriptions.Item>
            <ProDescriptions.Item key={1} label="Tanggal Pengajuan">
              {formatDateTime(detail?.created_at, 'DD/MM/YYYY HH:mm:ss', isoDateFormat)}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              key={2}
              label="Status"
              dataIndex={'status'}
              valueEnum={CreditStatuses}
            ></ProDescriptions.Item>
          </ProDescriptions>
          <ProDescriptions dataSource={detail} column={2}>
            <ProDescriptions.Item
              key={111}
              label="Nama Anggota"
              dataIndex={['user', 'name']}
            ></ProDescriptions.Item>
            <ProDescriptions.Item
              key={112}
              label="No Anggota"
              dataIndex={['user', 'member', 'member_no']}
            ></ProDescriptions.Item>
          </ProDescriptions>

          <Divider></Divider>

          {detail && (
            <ProDescriptions title={'Data Kredit'} dataSource={detail} column={2}>
              <ProDescriptions.Item key={21} label="Harga Beli">
                {formatRupiah(detail?.buy_price)}
              </ProDescriptions.Item>
              <ProDescriptions.Item key={22} label="Harga Jual">
                {formatRupiah(detail?.sell_price)}
              </ProDescriptions.Item>
              <ProDescriptions.Item key={23} label="Margin">
                {formatRupiah((detail?.sell_price ?? 0) - (detail?.buy_price ?? 0))}
              </ProDescriptions.Item>
              <ProDescriptions.Item key={24} label="Tenor">
                {detail?.installment_term} Bulan
              </ProDescriptions.Item>
              <ProDescriptions.Item key={25} label="Cicilan / Bulan">
                {formatRupiah(detail!.sell_price / detail!.installment_term)}
              </ProDescriptions.Item>
            </ProDescriptions>
          )}
          <Divider></Divider>
          <ProDescriptions column={2}>
            <ProDescriptions.Item key={32} label="Barang / Keperluan">
              {detail?.note}
            </ProDescriptions.Item>
          </ProDescriptions>

          <Divider />
          {detail && (
            <table className="simple-table">
              <thead>
                <tr>
                  <th>Total Angsuran</th>
                  <th>Dibayarkan</th>
                  <th>Sisa</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{formatRupiah(detail.sell_price)}</td>
                  <td>{formatRupiah(detail.total_paid)}</td>
                  <td>{formatRupiah(Math.max(detail.sell_price - detail.total_paid, 0))}</td>
                </tr>
              </tbody>
            </table>
          )}
        </Card>
        <div className="page-break"></div>
        {detail && (
          <PaymentList
            style={{ marginTop: '12px' }}
            payments={detail.payment_histories}
            credit={detail}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default StoreCreditListPage;
