import { downloadUrl } from '@/common/utils/utils';
import { FileExcelOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormInstance,
  ProFormUploadDragger,
  ProFormUploadDraggerProps,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import confirm from 'antd/lib/modal/confirm';
import React, { useEffect, useRef } from 'react';
import { importExcel } from './service';

type ExcelImportModalProp = {
  isModalOpen: boolean;
  setIsModalOpen: (flag: boolean) => void;
  onUploaded?: (data: any) => void;
  url: string;
  key?: string;
  templateUrl?: string;
  title?: string;
  param?: { [key: string]: any };
};

const ExcelImportModal: React.FC<ExcelImportModalProp> = ({
  isModalOpen,
  setIsModalOpen,
  onUploaded,
  url,
  key = 'file',
  templateUrl,
  title = 'File Excel',
  param,
}) => {
  const fromRef = useRef<ProFormInstance>();

  useEffect(() => {
    fromRef.current?.resetFields();
  }, [isModalOpen]);

  const props: ProFormUploadDraggerProps = {
    name: 'file',
    max: 1,
    label: 'File Excel',
    title: 'Pilih file excel',
    description: 'Pilih file xlsx / xls sesuai format',
    rules: [{ required: true, message: 'Mohon pilih file' }],
    accept:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  };

  async function uploadData(values: any) {
    const file = values.file[0].originFileObj;
    try {
      const response = await importExcel(file, url, key, param);
      if (response.success) {
        if (onUploaded) {
          onUploaded(response.data);
          setIsModalOpen(false);
        }
      }
    } catch (e: any) {
      console.log(e);
      if (e.response?.data?.errors) {
        if (Array.isArray(e.response.data.errors)) {
          e.response.data.errors.forEach((value: any) => {
            message.error(value);
          });
        } else {
          Object.values(e.response.data.errors).forEach((value: any) => {
            message.error(value);
          });
        }
      }
    }
  }

  return (
    <ModalForm
      formRef={fromRef}
      title={'Upload ' + title}
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
      submitter={{
        searchConfig: {
          submitText: 'Import File Excel',
        },
      }}
      onFinish={async (value) => {
        return new Promise<boolean>(function (resolve, reject) {
          confirm({
            title: 'Anda yakin file yang anda upload sudah benar?',
            okCancel: true,
            okText: 'Sudah benar',
            onOk: async () => {
              await uploadData(value);
              resolve(true);
            },
            onCancel: () => {
              reject(false);
            },
          });
        });
      }}
    >
      <ProFormUploadDragger {...props}></ProFormUploadDragger>
      {templateUrl != undefined && (
        <Button
          onClick={() => {
            downloadUrl(templateUrl);
          }}
          type="primary"
          style={{ width: '100%' }}
        >
          <FileExcelOutlined />
          Download template
        </Button>
      )}
    </ModalForm>
  );
};

export default ExcelImportModal;
