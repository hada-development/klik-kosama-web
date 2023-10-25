import PrintHeader from '@/common/components/PrintHeader';
import { submissionStatuses } from '@/common/data/data';
import { formatDateTime, formatRupiah, isoDateFormat } from '@/common/utils/utils';
import { EditOutlined, PrinterOutlined } from '@ant-design/icons';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Button, Card, Divider, Typography, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { history, useParams } from 'umi';
import SubmissionValidationHistory from '../../component/SubmissionValidationHistory';
import { VoluntaryWithdrawSubmissionDetail } from '../data/data';
import { getVoluntaryWithdrawSubmissionDetail } from '../data/service';
import VoluntaryWithdrawEditModal from './component/EditModal';

const { Text, Link } = Typography;

const VoluntaryWithdrawSubmissionDetailPage: React.FC = (prop) => {
  const { parameter } = useParams<{ parameter: string }>();
  const [detail, setDetail] = useState<VoluntaryWithdrawSubmissionDetail | undefined>();

  const printableRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printableRef.current!,
  });

  const [isModalEditOpen, setModalEdit] = useState(false);

  useEffect(() => {
    if (parameter != null) {
      getData(parseInt(parameter));
    }
  }, [parameter]);

  const getData = (id: number) => {
    setDetail(undefined);
    getVoluntaryWithdrawSubmissionDetail(id)
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
        title: `Pengajuan Simpanan Sukarela - ${detail?.parent_submission.number ?? ''} `,
        extra: (
          <Button onClick={handlePrint}>
            <PrinterOutlined /> Cetak Halaman
          </Button>
        ),
      }}
    >
      <div className="printable-area" ref={printableRef}>
        <PrintHeader title="PENGAJUAN PENARIKAN SIMPANAN SUKARELA" />
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
              dataIndex={['member', 'member_no']}
            ></ProDescriptions.Item>
            <ProDescriptions.Item
              key={3}
              label="Nama Anggota"
              dataIndex={['member', 'name']}
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

          <Divider></Divider>

          <div>
            <Text>Jumlah Penarikan</Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Text strong style={{ display: 'block', fontSize: 20 }}>
                {formatRupiah(detail?.amount)}
              </Text>
              {detail?.status == 'review' && (
                <Button
                  className={'hide-on-print'}
                  onClick={() => {
                    setModalEdit(true);
                  }}
                  type={'primary'}
                  size={'small'}
                >
                  <EditOutlined /> Ubah
                </Button>
              )}
            </div>
          </div>
        </Card>

        {detail != undefined && (
          <VoluntaryWithdrawEditModal
            submission={detail!}
            isOpen={isModalEditOpen}
            setIsOpen={setModalEdit}
            onSuccess={() => {
              getData(detail.id);
              message.success('Berhasil mengupdate pegajuan');
            }}
          ></VoluntaryWithdrawEditModal>
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

export default VoluntaryWithdrawSubmissionDetailPage;
