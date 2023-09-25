import PublishStatusPicker from '@/common/components/PublishStatusPicker';
import { getPositionLevel } from '@/pages/HRIS/MasterData/PositionLevel/data/services/service';
import { DeleteOutlined, ExclamationCircleOutlined, FileExcelOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProForm,
  ProFormDatePicker,
  ProFormMoney,
  ProFormText,
} from '@ant-design/pro-components';
import { history, useLocation } from '@umijs/max';
import { Button, Card, Form, Modal, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { storeAdjustment } from '../../services/service';
import ExcelImportModal from '../components/ExcelImportModal';

const AllowanceAdjustment: React.FC = () => {
  const [form] = Form.useForm();
  const [details, setDetails] = useState<any[]>([
    {
      years: 0,
    },
  ]);
  const [payrollComponent, setPayrollComponent] = useState<any>();
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
  const [positionLevels, setPositionLevels] = useState<
    PositionLevelFeature.PositionLevelListItem[]
  >([]);
  const { confirm } = Modal;
  const location = useLocation();

  useEffect(() => {
    setPayrollComponent(location.state);
    if (!location.state) {
      history.replace('404');
    }
    getPositionLevel({})
      .then((data) => {
        setPositionLevels(data.data);
      })
      .catch((error) => {
        console.error('Error fetching position levels:', error);
      });
  }, []);

  const handleImportButton = () => {
    setOpenUploadModal(true);
  };

  const handleRemoveDetail = (years: string) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: 'Anda yakin ingin hapus komponen gaji ini?',
      onOk() {
        const updatedDetails = details.filter((detail) => detail.years !== years);
        setDetails(updatedDetails);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleSubmit = async (values: any): Promise<boolean> => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: 'Anda yakin ingin data yang anda masukkan sudah benar?',
      onOk: async () => {
        const remappedData = values.details
          .filter((e: any) => e != undefined)
          .reduce(
            (result: any, detail: any) => {
              for (const positionLevel of positionLevels) {
                result.details.push({
                  years: detail.years,
                  position_level_id: positionLevel.id,
                  amount: detail['position_level_' + positionLevel.id],
                });
              }
              return result;
            },
            { ...values, details: [] },
          );
        const data = {
          ...remappedData,
          payroll_component_id: payrollComponent.id,
        };

        console.log(data);
        const response = await storeAdjustment(data);
        if (response.success) {
          message.success('Berhasil Menyimpan Data');
          history.replace(`/hris/payroll/payroll-component/${payrollComponent.id}`);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
    return true;
  };

  const columns = [
    ...positionLevels.map((level) => ({
      title: level.name,
      dataIndex: 'position_level_' + level.id?.toString(),
      // key: level.id,
      width: 200,
      render: (text: any, record: any) => (
        <ProFormMoney
          name={['details', record.years, 'position_level_' + level.id?.toString()]}
          initialValue={text}
          locale="id-ID"
          placeholder={'Masukkan Nominal'}
          rules={[{ required: true, message: 'Mohon Masukkan nominal' }]}
          min={0}
        />
      ),
    })),
    {
      title: '',
      key: 'action',
      width: 5,
      render: (text: any, record: any) => (
        <Button danger onClick={() => handleRemoveDetail(record.years)}>
          <DeleteOutlined />
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card title={'Tambah Adjustment ' + (payrollComponent?.name ?? '')}>
        <ProForm form={form} onFinish={handleSubmit}>
          <ProForm.Group>
            <ProFormText
              width={'md'}
              name={'title'}
              label={'Judul Adjustment'}
              rules={[{ required: true, message: 'Please input title!' }]}
            />

            <ProFormDatePicker
              width={'sm'}
              name={'effective_date'}
              label={'Tanggal Efektif'}
              rules={[{ required: true, message: 'Please input effective date!' }]}
            />

            <PublishStatusPicker
              width={'sm'}
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status!' }]}
            />
          </ProForm.Group>

          <Button style={{ float: 'right', marginBottom: '12px' }} onClick={handleImportButton}>
            <FileExcelOutlined /> Import Dari Excel
          </Button>
          {/* Details Input for Adjustment */}
          <Table
            bordered
            dataSource={details}
            columns={columns}
            pagination={false}
            rowKey="years"
          />
        </ProForm>
      </Card>
      <ExcelImportModal
        onUploaded={(data) => {
          setDetails(data);
        }}
        isModalOpen={openUploadModal}
        setIsModalOpen={setOpenUploadModal}
      />
    </PageContainer>
  );
};

export default AllowanceAdjustment;
