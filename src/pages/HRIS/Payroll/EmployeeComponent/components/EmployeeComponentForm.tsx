import { DrawerForm, ProDescriptions, ProFormInstance } from '@ant-design/pro-components';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Spin, Table } from 'antd';
import confirm from 'antd/es/modal/confirm';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { getComponentItems, storeEmployeeComponent } from '../data/services/service';
import ComponentEditForm from './ComponentEditForm';

export type EmployeeComponentFormProps = {
  onCancel: (flag?: boolean, formVals?: EmployeeComponentFeature.EmployeeComponentListItem) => void;
  onSubmit: (values: EmployeeComponentFeature.EmployeeComponentListItem[]) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<EmployeeComponentFeature.EmployeeComponentListItem>;
};

const EmployeeComponentForm: React.FC<EmployeeComponentFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();
  const [loading, setLoading] = useState(true);
  const [componentItems, setComponentItems] = useState<
    EmployeeComponentFeature.PayrollComponentItem[]
  >([]);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    EmployeeComponentFeature.PayrollComponentItem | undefined
  >();

  useEffect(() => {
    if (props.values) {
      getComponentItems(props.values!.employee_id!).then(function (data) {
        setComponentItems(data);
        setLoading(false);
      });
    }
  }, [props.open, props.values]);

  const confirmSubmit = async (value: EmployeeComponentFeature.EmployeeComponentListItem[]) => {
    return new Promise(async (resolve, reject) => {
      confirm({
        title: 'Anda yakin ingin menyimpan data ini?',
        content: 'Pastikan data yang anda masukkan sudah benar',
        onOk: () => {
          handleSubmit(value).then(() => {
            resolve(true);
          });
        },
      });
    });
  };

  const handleSubmit = async (values: EmployeeComponentFeature.EmployeeComponentListItem[]) => {
    try {
      const data: EmployeeComponentFeature.EmployeePayrollComponentDTO = {
        employee_id: props.values!.employee_id!,
        items: componentItems.map((e) => ({
          component_id: e.hr_payroll_component_id,
          amount: e.amount,
          formula_id: e.formula?.id,
        })),
      };
      console.log(data);
      await storeEmployeeComponent(data);
      props.onSubmit(values);
      return true;
    } catch (error) {
      console.error(error);
    } finally {
      props.onCancel();
    }
  };

  const handleChange = async (data: any): Promise<boolean> => {
    if (data != null || data != undefined) {
      if (data.id != null || data.id != undefined) {
        const newArray = componentItems;
        const index = newArray.findIndex((e) => e.id == data.id);
        newArray[index] = data;
        setComponentItems(newArray);
      } else {
        console.log('PUSH NEW');
        const newArray = [...componentItems];
        const id = ([...newArray].sort((a, b) => b.id - a.id).slice(-1)[0]?.id ?? 0) + 1;
        console.log(id);
        newArray.push({
          ...data,
          id: id,
        });
        setComponentItems(newArray);
      }
    }
    return true;
  };

  useEffect(() => {
    console.log(componentItems);
  }, [componentItems]);

  const handleDelete = (index: number): void => {
    const newArray = [...componentItems].filter((val) => val.id != index);
    console.log(index);
    console.log(newArray);
    setComponentItems(newArray);
  };

  const columns = [
    {
      title: 'Komponen',
      dataIndex: ['component', 'name'],
      key: 'payroll_component_id',
    },
    {
      title: 'Formula',
      dataIndex: ['formula', 'name'],
      key: 'formula_id',
      render: (data: any) => {
        if (data == null) {
          return 'Nominal Fix';
        }
        return data;
      },
    },
    {
      title: 'Nominal',
      dataIndex: 'amount',
      align: 'right' as const,
      key: 'amount',
      render: (data: any) => {
        if (isNaN(data)) {
          return data;
        }
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0,
        }).format(data);
      },
    },
    {
      title: 'Action',
      key: 'action',
      valueType: 'option',
      render: (_: any, record: any) => [
        <a
          key="edit"
          onClick={() => {
            setEditOpen(true);
            setSelectedItem(record);
          }}
        >
          <EditOutlined /> Edit
        </a>,
        <a
          key="delete"
          onClick={() => {
            handleDelete(record.id);
          }}
        >
          <DeleteOutlined /> Hapus
        </a>,
      ],
    },
  ];

  return (
    <DrawerForm
      title={'Detail Komponen Gaji Pegawai'}
      size="large"
      formRef={formRef}
      open={props.open}
      onOpenChange={props.setOpen}
      onFinish={async (value) => {
        await confirmSubmit(value);
        props.setOpen!(false);
      }}
    >
      <Spin spinning={loading}>
        <ProDescriptions column={2}>
          <ProDescriptions.Item label="Nama Pegawai"> {props?.values?.name} </ProDescriptions.Item>
          <ProDescriptions.Item label="NIP"> {props?.values?.nip} </ProDescriptions.Item>
          <ProDescriptions.Item label="Jabatan"> {props?.values?.position} </ProDescriptions.Item>
          <ProDescriptions.Item label="Jenis Pegawai">
            {' '}
            {props?.values?.employee_type}{' '}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Instansi"> {props?.values?.company} </ProDescriptions.Item>
        </ProDescriptions>

        <Table columns={columns} dataSource={[...componentItems]} pagination={false} rowKey="id" />

        <Button
          style={{ width: '100%' }}
          onClick={() => {
            setEditOpen(true);
            setSelectedItem(undefined);
          }}
        >
          + Tambah Komponen
        </Button>

        <ComponentEditForm
          open={editOpen}
          setOpen={setEditOpen}
          onCancel={() => {}}
          onSubmit={handleChange}
          values={selectedItem}
        ></ComponentEditForm>
      </Spin>
    </DrawerForm>
  );
};

export default EmployeeComponentForm;
