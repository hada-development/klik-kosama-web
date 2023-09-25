import PreviewImageLink from '@/common/components/PreviewImageLink';
import { submissionStatuses } from '@/common/data/data';
import { formatDateTime, formatRupiah, isoDateFormat } from '@/common/utils/utils';
import { PaperClipOutlined } from '@ant-design/icons';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Card, Divider, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, useParams } from 'umi';
import SubmissionValidationHistory from '../../component/SubmissionValidationHistory';
import { CreditSubmissionSubmissionDetail } from '../data/data';
import { getCreditSubmissionSubmissionDetail } from '../data/service';
import CreditSubmissionEditModal from './component/EditModal';

const { Text, Link } = Typography;

const CreditSubmissionSubmissionDetailPage: React.FC = (prop) => {
  const { parameter } = useParams<{ parameter: string }>();
  const [detail, setDetail] = useState<CreditSubmissionSubmissionDetail | undefined>();

  const [isModalEditOpen, setModalEdit] = useState(false);

  useEffect(() => {
    if (parameter != null) {
      getData(parseInt(parameter));
    }
  }, [parameter]);

  const getData = (id: number) => {
    setDetail(undefined);
    getCreditSubmissionSubmissionDetail(id)
      .then((value) => {
        console.log(value);
        setDetail(value);
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
        title: `Pengajuan Kredit Barang - ${detail?.parent_submission.number ?? ''} `,
      }}
    >
      <Card loading={detail == undefined}>
        <ProDescriptions dataSource={detail} column={2}>
          <ProDescriptions.Item
            key={0}
            label="No. Pengajuan"
            dataIndex={['parent_submission', 'number']}
          ></ProDescriptions.Item>
          <ProDescriptions.Item key={1} label="Tanggal Pengajuan">
            {formatDateTime(detail?.created_at, 'DD/MM/YYYY HH:mm:ss', isoDateFormat)}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            key={1}
            label="Status"
            dataIndex={'status'}
            valueEnum={submissionStatuses}
          ></ProDescriptions.Item>
          <ProDescriptions.Item key={1} label="Posisi Saat Ini">
            {detail?.status_text}
          </ProDescriptions.Item>

          <ProDescriptions.Item
            key={4}
            label="Keterangan"
            dataIndex={'note'}
          ></ProDescriptions.Item>
        </ProDescriptions>

        <Divider></Divider>

        <ProDescriptions dataSource={detail} column={2}>
          <ProDescriptions.Item
            key={2}
            label="No. Anggota"
            dataIndex={['user', 'member', 'member_no']}
          ></ProDescriptions.Item>
          <ProDescriptions.Item
            key={3}
            label="Nama Anggota"
            dataIndex={['user', 'name']}
          ></ProDescriptions.Item>
          <ProDescriptions.Item key={11} label="Simpanan Pokok">
            {formatRupiah(detail?.savings.principal_saving)}
          </ProDescriptions.Item>
          <ProDescriptions.Item key={12} label="Simpanan Wajib">
            {formatRupiah(detail?.savings.mandatory_saving)}
          </ProDescriptions.Item>
          <ProDescriptions.Item key={13} label="Simpanan Sukarela">
            {formatRupiah(detail?.savings.voluntary_saving)}
          </ProDescriptions.Item>
          <ProDescriptions.Item key={14} label="Total Simpanan">
            {formatRupiah(detail?.savings.total_saving)}
          </ProDescriptions.Item>
        </ProDescriptions>

        {detail && (
          <table className="simple-table">
            <thead>
              <tr>
                <th>Hutang Barang</th>
                <th>Jumlah Hutang Barang</th>
                <th>Total Dibayar</th>
                <th>Sisa Hutang</th>
              </tr>
            </thead>
            <tbody>
              {detail.user_credits.map((credit) => (
                <tr>
                  <td>{credit.note}</td>
                  <td>{formatRupiah(credit.sell_price)}</td>
                  <td>{formatRupiah(credit.total_paid)}</td>
                  <td>{formatRupiah(credit.sell_price - credit.total_paid)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={{ textAlign: 'right', fontWeight: 'bold' }} colSpan={3}>
                  Total Hutang
                </td>
                <td>{formatRupiah(detail.user_unpaid_load)}</td>
              </tr>
            </tfoot>
          </table>
        )}

        <Divider></Divider>

        {detail && (
          <ProDescriptions dataSource={detail} column={2}>
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
          <ProDescriptions.Item key={31} label="Jenis Pengajuan">
            {detail?.type.name}
          </ProDescriptions.Item>
          <ProDescriptions.Item key={32} label="Barang / Keperluan">
            {detail?.note}
          </ProDescriptions.Item>
          <ProDescriptions.Item key={33} label="Lampiran">
            {(detail?.file && (
              <PreviewImageLink file={detail!.file}>
                {' '}
                <PaperClipOutlined /> {detail.file.name}{' '}
              </PreviewImageLink>
            )) ||
              '-'}
          </ProDescriptions.Item>
        </ProDescriptions>
      </Card>

      {detail != undefined && (
        <CreditSubmissionEditModal
          submission={detail!}
          isOpen={isModalEditOpen}
          setIsOpen={setModalEdit}
          onSuccess={() => {
            getData(detail.id);
            message.success('Berhasil mengupdate pegajuan');
          }}
        ></CreditSubmissionEditModal>
      )}

      {detail != undefined && (
        <SubmissionValidationHistory
          style={{ marginTop: '10px' }}
          submission_id={detail.submission_id}
        />
      )}
    </PageContainer>
  );
};

export default CreditSubmissionSubmissionDetailPage;
