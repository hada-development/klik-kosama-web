import TableTransfer, { DataType } from '@/common/components/TableTransfer';
import { getEmployee } from '@/pages/HRIS/Employee/data/services/service';
import { ModalForm, ProFormSelect } from '@ant-design/pro-components';
import { Tag, message } from 'antd';
import confirm from 'antd/es/modal/confirm';
import { ColumnsType } from 'antd/es/table';
import Title from 'antd/es/typography/Title';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getPayrollTemplate, postPayrollTemplate } from '../../data/services/service';

type TemplateGenerateModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onFinish: () => Promise<void>;
};

const leftTableColumns: ColumnsType<DataType> = [
  {
    dataIndex: 'title',
    title: 'Name',
    width: '100px',
  },
  {
    dataIndex: 'tag',
    title: 'Instansi',
    width: '80px',
    render: (tag) => <Tag>{tag}</Tag>,
    onFilter: (value, record) => record.tag.includes(value.toString()),
    filters: [
      { text: 'KOSAMA', value: 'KOSAMA' },
      { text: 'KMU', value: 'KMU' },
    ],
  },
  {
    dataIndex: 'description',
    title: 'Jabatan',
    width: '100px',
  },
  {
    dataIndex: 'employeeType',
    title: 'Jenis Pegawai',
    width: '100px',
    onFilter: (value, record) => record.employeeType.includes(value.toString()),
    filters: [
      { text: 'PEGAWAI TETAP', value: 'PEGAWAI TETAP' },
      { text: 'PEGAWAI KONTRAK', value: 'PEGAWAI KONTRAK' },
      { text: 'TKWT', value: 'TKWT' },
    ],
  },
];

const rightTableColumns: any = [
  {
    dataIndex: 'title',
    title: 'Name',
    width: '100px',
  },
  {
    dataIndex: 'description',
    title: 'Jabatan',
    width: '100px',
  },
];

const TemplateGenerateModal: React.FC<TemplateGenerateModalProps> = (props) => {
  const [employeeList, setEmployeeList] = useState<EmployeeFeature.EmployeeList>();
  const [templateList, setTemplateList] = useState<EmployeeComponentFeature.PayrollTemplate[]>();

  const [selectedTemplate, setSelectedTemplate] =
    useState<EmployeeComponentFeature.PayrollTemplate>();

  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const onChange = (nextTargetKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
  };

  const handleSubmit = async (value: any) => {
    // props.setOpen(false);
    if (targetKeys.length == 0) {
      message.error('Mohon pilih min: 1 karyawan');
      return false;
    }

    const data = {
      employee_ids: targetKeys,
      template_id: value.template_id,
    };
    await postPayrollTemplate(data);
  };

  useEffect(() => {
    setTargetKeys([]);
    getEmployee({}, {}).then((e) => {
      setEmployeeList(e);
    });

    getPayrollTemplate().then((e) => {
      setTemplateList(e.data);
    });
  }, [props.open]);

  return (
    <ModalForm
      title={'Generate dari template'}
      open={props.open}
      onOpenChange={props.setOpen}
      width={'1000px'}
      onFinish={async (value) => {
        return new Promise<boolean>((resolve, _) => {
          confirm({
            title: 'Data sudah benar?',
            content: 'Anda yakin data yang anda masukkan sudah benar?',
            cancelText: 'Batalkan',
            closable: true,
            okCancel: true,
            okText: 'Generate',
            onOk: async () => {
              await handleSubmit(value);
              await props.onFinish();
              resolve(true);
              props.setOpen(false);
            },
            onCancel: () => {
              resolve(false);
            },
          });
        });
      }}
    >
      <Title level={5}>Pilih Template</Title>
      <ProFormSelect
        options={templateList?.map((e) => ({
          value: e.id,
          label: e.name,
        }))}
        name="template_id"
        placeholder={'Pilih Template'}
        rules={[{ required: true, message: 'Wajib diisi' }]}
      />

      <Title level={4}>Pilih Pegawai</Title>
      <TableTransfer
        dataSource={
          employeeList?.data?.map<DataType>((e) => ({
            key: e.id!.toString(),
            title: e.user!.name!,
            description: e.position!.name!,
            disabled: false,
            tag: e.company?.alias!,
            employeeType: e.employee_type!.name!,
          })) ?? []
        }
        targetKeys={targetKeys}
        disabled={false}
        showSearch={true}
        onChange={onChange}
        filterOption={(inputValue, item) =>
          item.title!.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1 ||
          item.tag.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1 ||
          item.employeeType.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
        }
        leftColumns={leftTableColumns}
        rightColumns={rightTableColumns}
      />
    </ModalForm>
  );
};

export default TemplateGenerateModal;
