import PreviewImageLink from '@/common/components/PreviewImageLink';
import PrintHeader from '@/common/components/PrintHeader';
import { submissionStatuses } from '@/common/data/data';
import { downloadUrl, formatDateTime, formatRupiah, isoDateFormat } from '@/common/utils/utils';
import {
  DeleteOutlined,
  EditOutlined,
  PaperClipOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Button, Card, Divider, message } from 'antd';
import confirm from 'antd/lib/modal/confirm';
import React, { useEffect, useRef, useState } from 'react';
import { history, useParams } from 'umi';
import SubmissionValidationHistory from '../../component/SubmissionValidationHistory';
import { CreditSubmissionSubmissionDetail } from '../data/data';
import { deleteCreditSubmission, getCreditSubmissionSubmissionDetail } from '../data/service';
import CreditSubmissionEditModal from './component/EditModal';

const CreditSubmissionSubmissionDetailPage: React.FC = () => {
  const { parameter } = useParams<{ parameter: string }>();
  const [detail, setDetail] = useState<CreditSubmissionSubmissionDetail | undefined>();

  const [isModalEditOpen, setModalEdit] = useState(false);

  const printableRef = useRef(null);
  const handlePrint = (id: number) => {
    downloadUrl(`/api/web/coop/submission/credit/pdf/${id}`);
  };

  const handleDelete = (id: number): void => {
    confirm({
      title: 'Hapus data?',
      content: 'Anda yakin ingin menghapus data ini?',
      cancelText: 'Batalkan',
      closable: true,
      okCancel: true,
      okText: 'Simpan',
      onOk: async () => {
        await deleteCreditSubmission(id);
        history.push('/coop/submission/credit');
        message.success('Berhasil menghapus pengajuan');
      },
      onCancel: () => {},
    });
  };

  const getData = (id: number) => {
    setDetail(undefined);
    getCreditSubmissionSubmissionDetail(id)
      .then((value) => {
        console.log(value);
        setDetail(value);
      })
      .catch((e) => {
        console.log(e);
        if (e.response?.status === 404) {
          history.push('/not-found');
        }
      });
  };

  useEffect(() => {
    if (parameter !== null) {
      getData(parseInt(parameter));
    }
  }, [parameter]);

  return (
    <PageContainer
      header={{
        title: `Pengajuan Kredit Barang - ${detail?.parent_submission.number ?? ''} `,
        extra: (
          <>
            <Button
              onClick={() => {
                if (detail) {
                  handlePrint(detail!.id);
                }
              }}
            >
              <PrinterOutlined /> Cetak Halaman
            </Button>
            <Button
              danger={true}
              onClick={() => {
                if (detail) {
                  handleDelete(detail!.id);
                }
              }}
            >
              <DeleteOutlined /> Hapus Pengajuan
            </Button>
          </>
        ),
      }}
    >
      <div className="printable-area" ref={printableRef}>
        <PrintHeader title="PENGAJUAN KREDIT BARANG" />
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

          <ProDescriptions title={'Data Pengaju'} dataSource={detail} column={2}>
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
            <ProDescriptions
              title={'Data Pengajuan'}
              extra={
                <Button className="hide-on-print" onClick={() => setModalEdit(true)}>
                  <EditOutlined /> Ubah Pengajuan
                </Button>
              }
              dataSource={detail}
              column={2}
            >
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

        <div className="page-break"></div>
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
      </div>
    </PageContainer>
  );
};

export default CreditSubmissionSubmissionDetailPage;
