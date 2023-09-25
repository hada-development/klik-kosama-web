import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { DrawerForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { Button, Table } from 'antd';
import confirm from 'antd/es/modal/confirm';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { addPayrollTemplate, editPayrollTemplate } from '../data/services/service';
import ComponentEditForm from './ComponentEditForm';

interface PayrollTemplateForm {
  onCancel: (flag?: boolean, formVals?: PayrollTemplateFeature.PayrollTemplateListItem) => void;
  onSubmit: (values: PayrollTemplateFeature.PayrollTemplateListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<PayrollTemplateFeature.PayrollTemplateListItem>;
}

const PayrollTemplateForm: React.FC<PayrollTemplateForm> = (props) => {
  const [componentItems, setComponentItems] = useState<
    PayrollTemplateFeature.PayrollTemplateItem[]
  >([]);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    PayrollTemplateFeature.PayrollTemplateItem | undefined
  >();
  const formRef = useRef<ProFormInstance>();

  const handleDelete = (index: number): void => {
    const newArray = [...componentItems].filter((val) => val.id != index);
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
      dataIndex: 'fixed_amount',
      align: 'right' as const,
      key: 'fixed_amount',
      render: (data: any) => {
        if (isNaN(data) || data == 0 || data == null) {
          return '-';
        }
        console.log(data);
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

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);
      setComponentItems(props.values?.items ?? []);
    } else {
      formRef.current?.resetFields();
      setComponentItems([]);
    }
  }, [props.open, props.values, formRef]);

  const handleSubmit = async (values: any): Promise<void> => {
    return new Promise<void>((resolve, _) => {
      confirm({
        title: 'Sudah benar?',
        content: 'Anda yakin data yang anda masukkan sudah benar?',
        onOk: async () => {
          try {
            const data: any = {
              name: values.name,
              description: values.description,
              items: componentItems,
            };
            if (props.values) {
              await editPayrollTemplate(props.values.id!, data);
            } else {
              await addPayrollTemplate(data);
            }
            props.onSubmit(values);
          } catch (error) {
            console.error(error);
          } finally {
            props.onCancel();
          }
          resolve();
        },
      });
    });
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

  return (
    <DrawerForm
      formRef={formRef}
      title={props.values != undefined ? 'Edit Template' : 'Tambah Template'}
      size="large"
      open={props.open}
      onOpenChange={props.setOpen}
      onFinish={async (value) => {
        await handleSubmit(value);
        props.setOpen!(false);
      }}
    >
      <ProFormText label="Nama Template" name="name" placeholder="Masukkan Nama Template" />
      <ProFormText label="Deskripsi" name="description" placeholder="Masukkan Deskripsi" />

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
    </DrawerForm>
  );
};

export default PayrollTemplateForm;
