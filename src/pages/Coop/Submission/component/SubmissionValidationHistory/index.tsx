import PreviewImageLink from '@/common/components/PreviewImageLink';
import { submissionStatuses } from '@/common/data/data';
import { formatDateTime, isoDateFormat } from '@/common/utils/utils';
import { CheckOutlined, CloseOutlined, PaperClipOutlined } from '@ant-design/icons';
import { FooterToolbar, ProTable } from '@ant-design/pro-components';
import { Button, Card, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Submission } from '../../data/data';
import { getSubmissionDetail } from '../../data/service';
import { ApprovalModalForm } from './approval-modal';

// Approval Status type
export type ApprovalStatus = 'accepted' | 'rejected';

const { Text } = Typography;

// SubmissionValidationHistory component
const SubmissionValidationHistory: React.FC<{ submission_id: number; [key: string]: any }> = ({
  submission_id,
  ...prop
}) => {
  const [submission, setSubmission] = useState<Submission | undefined>();
  const [currentApprovalStatus, setCurrentApprovalStatus] = useState<ApprovalStatus | undefined>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    getSubmissionDetail(submission_id)
      .then((data) => setSubmission(data))
      .catch((e) => {
        console.log(e);
      });
  }, [submission_id]);

  // Function to handle approval click
  function handleApprovalClick(status: ApprovalStatus) {
    setCurrentApprovalStatus(status);
    setIsModalOpen(true);
  }

  return (
    <>
      <Card title="History Pengajuan" loading={!submission} {...prop}>
        <ProTable
          dataSource={submission?.histories}
          search={false}
          key={'id'}
          pagination={false}
          toolBarRender={false}
          columns={[
            {
              title: 'Tanggal',
              dataIndex: 'created_at',
              render: (data: any) => formatDateTime(data, 'DD/MM/YYYY HH:mm:ss', isoDateFormat),
            },
            {
              title: 'Posisi',
              dataIndex: ['step', 'name'],
            },
            {
              title: 'User',
              dataIndex: ['user', 'name'],
            },
            {
              title: 'Status',
              dataIndex: 'status',
              valueEnum: submissionStatuses,
            },
            {
              title: 'Note',
              dataIndex: 'note',
              width: '220px',
              render: (data, record) => {
                if (record.file) {
                  return (
                    <>
                      {data} <br />
                      <PreviewImageLink file={record.file} width={200} elipsis={true}>
                        {' '}
                        <PaperClipOutlined />
                        {record.file.name}{' '}
                      </PreviewImageLink>
                    </>
                  );
                }
                return data;
              },
            },
          ]}
        />
      </Card>

      {submission?.is_approvable && (
        <SubmissionFooterToolbar onApprovalClick={handleApprovalClick} />
      )}

      {submission && (
        <ApprovalModalForm
          isVisible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          approvalStatus={currentApprovalStatus}
          submission={submission}
        />
      )}
    </>
  );
};

// SubmissionFooterToolbar component
const SubmissionFooterToolbar: React.FC<{ onApprovalClick: (status: ApprovalStatus) => void }> = ({
  onApprovalClick,
}) => {
  return (
    <FooterToolbar>
      <Button type="primary" onClick={() => onApprovalClick('accepted')}>
        <CheckOutlined /> Setujui Pengajuan
      </Button>
      <Button type="primary" onClick={() => onApprovalClick('rejected')} danger>
        <CloseOutlined /> Tolak Pengajuan
      </Button>
    </FooterToolbar>
  );
};

export default SubmissionValidationHistory;
