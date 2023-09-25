import {
  ModalForm,
  ProFormDatePicker,
  ProFormTextArea,
  ProFormUploadDragger,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { ApprovalStatus } from '.';
import { Submission } from '../../data/data';
import { postApproval } from '../../data/service';

export const ApprovalModalForm: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  approvalStatus: ApprovalStatus | undefined;
  submission: Submission;
}> = ({ isVisible, onClose, approvalStatus, submission }) => {
  // Function to submit approval
  const submitApproval = async (values: any) => {
    try {
      await postApproval(submission.id, { ...values, status: approvalStatus });
      onClose();
      message.success('Berhasil mengupdate data');
      window.location.reload();
    } catch (error) {
      console.error('Approval submission error:', error);
    }
  };

  return (
    <ModalForm
      title={`Anda yakin ${approvalStatus === 'accepted' ? 'Setujui' : 'Tolak'} Pengajuan?`}
      width={500}
      submitter={{
        searchConfig: {
          submitText: approvalStatus === 'accepted' ? 'Setujui' : 'Tolak',
        },
      }}
      open={isVisible}
      onOpenChange={(open) => !open && onClose()}
      onFinish={submitApproval}
    >
      {/* Render additional fields based on type */}
      {submission?.current_step?.rule?.additional_fields?.map((field) => (
        <div key={field.id}>
          {field.type === 'image' && (
            <ProFormUploadDragger
              accept="image/*"
              name={field.id}
              label={field.name}
              max={1}
              rules={[{ required: true, message: 'Mohon isi' }]}
              title="Pilih bukti serah terima"
              description="Pilih satu file gambar"
            />
          )}

          {field.type === 'date' && (
            <ProFormDatePicker
              width="xl"
              rules={[{ required: true, message: 'Mohon isi' }]}
              name={field.id}
              label={field.name}
            />
          )}
        </div>
      ))}

      <ProFormTextArea
        name="note"
        label="Keterangan / Catatan"
        placeholder="Masukkan Keterangan / Catatan"
      />
    </ModalForm>
  );
};
