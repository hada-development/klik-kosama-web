import { InboxOutlined } from '@ant-design/icons';
import { Modal, UploadFile, message } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import { UploadProps } from 'antd/lib/upload';
import React, { useState } from 'react';
import { importExcel } from '../../services/service';

type ExcelImportModalProp = {
  isModalOpen: boolean;
  setIsModalOpen: (flag: boolean) => void;
  onUploaded?: (data: any) => void;
};

const ExcelImportModal: React.FC<ExcelImportModalProp> = ({
  isModalOpen,
  setIsModalOpen,
  onUploaded,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const props: UploadProps = {
    name: 'excel_file',
    multiple: false,
    maxCount: 1,
    customRequest: async (info) => {
      const response = await importExcel(info);
      if (response.success) {
        if (info.onSuccess) {
          info.onSuccess(response.data);
        }
        if (onUploaded) {
          onUploaded(response.data);
          setIsModalOpen(false);
        }
      }
    },
    accept:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <Modal
      title="Upload File Excel"
      open={isModalOpen}
      afterOpenChange={setIsModalOpen}
      onCancel={() => setIsModalOpen(false)}
      closable={true}
    >
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from uploading company data or
          other banned files.
        </p>
      </Dragger>
    </Modal>
  );
};

export default ExcelImportModal;
