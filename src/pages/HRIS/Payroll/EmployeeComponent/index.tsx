import { EditOutlined, ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Modal, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { getCompany } from '../../MasterData/Company/data/services/service';
import { getEmployeeType } from '../../MasterData/EmployeeType/data/services/service';
import { getPosition } from '../../MasterData/Position/data/services/service';
import EmployeeComponentForm from './components/EmployeeComponentForm';
import TemplateGenerateModal from './components/TemplateGenerate';
import { getEmployeeComponent, resetEmployeeComponent } from './data/services/service';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleReset = async () => {
  const hide = message.loading('Mohon Tunggu');

  try {
    await resetEmployeeComponent();
    hide();
    message.success('Reset successfully and will refresh soon');
    return true;
  } catch (error: any) {
    hide();
    let errorMessage: string | undefined = error.response?.data?.message;
    if (errorMessage) {
      message.error(errorMessage);
      return false;
    }
    message.error('Delete failed, please try again');
    return false;
  }
};

const EmployeeComponentPage: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<
    EmployeeComponentFeature.EmployeeComponentListItem | undefined
  >();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<
    EmployeeComponentFeature.EmployeeComponentListItem[]
  >([]);
  const [{ confirm }, contextHolder] = Modal.useModal();

  const [generateModalOpen, setGenerateModalOpen] = useState<boolean>(false);

  // Filter
  const [companyFilter, setCompanyFilter] = useState<CompanyFeature.CompanyListItem[]>();
  const [positionFilter, setPositionFilter] = useState<PositionFeature.PositionListItem[]>();
  const [employeeTypeFilter, setEmployeeTypeFilter] =
    useState<EmployeeTypeFeature.EmployeeTypeListItem[]>();

  useEffect(() => {
    getPosition({}).then((e) => {
      setPositionFilter(e.data);
    });
    getCompany({}).then((e) => {
      setCompanyFilter(e.data);
    });
    getEmployeeType({}).then((e) => {
      setEmployeeTypeFilter(e.data);
    });
  }, []);

  const actionRef = useRef<ActionType>();

  const onDelete = (record: EmployeeComponentFeature.EmployeeComponentListItem) => {
    confirm({
      title: 'Anda yakin ingin menghapus data ini?',
      icon: <ExclamationCircleFilled />,
      content: 'Data yang dihapus tidak dapat dikembalikan',
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batalkan',
      closable: true,
      onOk: async () => {
        actionRef.current?.reloadAndRest?.();
      },
      onCancel: () => {
        console.log('NO');
      },
    });
  };

  const columns: ProColumns<EmployeeComponentFeature.EmployeeComponentListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'employee_id',
    },
    {
      title: 'Nama Pegawai',
      dataIndex: 'name',
      ellipsis: true,
      width: 200,
      search: {
        transform: (value) => ({ 'u.name': value }), // Set the custom search parameter name
      },
    },
    {
      title: 'NIP',
      dataIndex: 'nip',
      width: 120,
      search: {
        transform: (value) => ({ 'e.nip': value }), // Set the custom search parameter name
      },
    },
    {
      title: 'Jenis Pegawai',
      dataIndex: 'employee_type',
      width: 150,
      search: {
        transform: (value) => ({
          'e.hr_employee_type_id': {
            value: value,
            operator: '=',
          },
        }),
      },
      valueEnum:
        employeeTypeFilter?.reduce((previousObject, currentObject) => {
          return Object.assign(previousObject, {
            [currentObject.id!]: currentObject.name,
          });
        }, {}) || {},
    },
    {
      title: 'Instansi',
      dataIndex: 'company',
      width: 120,
      search: {
        transform: (value) => ({
          'e.hr_company_id': {
            value: value,
            operator: '=',
          },
        }),
      },
      valueEnum:
        companyFilter?.reduce((previousObject, currentObject) => {
          return Object.assign(previousObject, {
            [currentObject.id!]: currentObject.alias,
          });
        }, {}) || {},
    },
    {
      title: 'Jabatan',
      dataIndex: 'position',
      width: 200,
      search: {
        transform: (value) => ({
          'e.hr_position_id': {
            value: value,
            operator: '=',
          },
        }), // Set the custom search parameter name
      },
      valueEnum:
        positionFilter?.reduce((previousObject, currentObject) => {
          return Object.assign(previousObject, {
            [currentObject.id!]: currentObject.name,
          });
        }, {}) || {},
    },
    {
      title: 'Masa Kerja',
      dataIndex: 'service_years',
      width: 120,
      search: false,
    },
    {
      title: 'Gaji Pokok + Tunjangan',
      dataIndex: 'total_salary',
      width: 200,
      search: false,
      render: (data: any, record: any) => {
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
      title: 'Aksi',
      dataIndex: 'option',
      width: '8%',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            handleModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <EditOutlined /> Edit
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      {contextHolder}
      <ProTable<EmployeeComponentFeature.EmployeeComponentListItem, API.PageParams>
        headerTitle="Daftar Komponen Gaji Pegawai"
        rowKey="employee_id"
        actionRef={actionRef}
        search={{
          labelWidth: 120,
        }}
        request={getEmployeeComponent}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        scroll={{
          x: 'max-content',
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setGenerateModalOpen(true);
            }}
          >
            <PlusOutlined /> Generate dari template
          </Button>,
          <Button
            type="default"
            danger={true}
            key="delete"
            onClick={async () => {
              const isConfirm = await confirm({
                title: 'Anda yakin ingin me-reset data komponen gaji karyawan',
                content:
                  'Aktifitas ini akan me-reset semua data komponen gaji karyawan, dan aktifitas ini tidak bisa dikembalikan',
              });
              if (isConfirm) {
                await handleReset();
                actionRef.current?.reloadAndRest?.();
              }
            }}
          >
            Reset Payroll
          </Button>,
        ]}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              Dipilih <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> Item
              &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              // await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            Batch Deletion
          </Button>
        </FooterToolbar>
      )}
      <EmployeeComponentForm
        onCancel={() => {}}
        onSubmit={async (value) => {
          if (actionRef.current) {
            console.log('SUCCES RELOAD');
            actionRef.current.reload();
          }
          return true;
        }}
        values={currentRow}
        open={createModalOpen}
        setOpen={handleModalOpen}
      />

      <TemplateGenerateModal
        open={generateModalOpen}
        onFinish={async () => {
          await actionRef.current?.reloadAndRest?.();
          message.success('Berhasil Menggenerate Data');
        }}
        setOpen={setGenerateModalOpen}
      />
    </PageContainer>
  );
};

export default EmployeeComponentPage;
