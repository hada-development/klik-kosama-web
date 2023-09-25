import { getEmployeeType } from '@/pages/HRIS/MasterData/EmployeeType/data/services/service';
import { getPosition } from '@/pages/HRIS/MasterData/Position/data/services/service';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { getCompany } from '../../MasterData/Company/data/services/service';
import { getEmployee } from '../data/services/service';
import EmployeeForm from './components/EmployeeForm';

const EmployeePage: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<EmployeeFeature.EmployeeListItem | undefined>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, handleDeleteModalOpen] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<EmployeeFeature.EmployeeListItem[]>([]);

  // FILTER
  const [companyFilter, setCompanyFilter] = useState<CompanyFeature.CompanyListItem[]>();
  const [positionFilter, setPositionFilter] = useState<PositionFeature.PositionListItem[]>();
  const [employeeTypeFilter, setEmployeeTypeFilter] =
    useState<EmployeeTypeFeature.EmployeeTypeListItem[]>();

  useEffect(() => {
    getPosition({}).then((e) => {
      setPositionFilter(e.data);
    });
    getEmployeeType({}).then((e) => {
      setEmployeeTypeFilter(e.data);
    });
    getCompany({}).then((e) => {
      setCompanyFilter(e.data);
    });
  }, []);

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<EmployeeFeature.EmployeeListItem>[] = [
    {
      title: 'Nama Pegawai',
      dataIndex: 'users.name',
      render: (_, record) => record.user?.name,
    },
    {
      title: 'NIP',
      dataIndex: 'nip',
    },
    {
      title: 'Instansi',
      dataIndex: 'hr_company_id',
      render: (_, record) => record.company?.alias,
      valueEnum:
        companyFilter?.reduce((previousObject, currentObject) => {
          return Object.assign(previousObject, {
            [currentObject.id!]: currentObject.alias,
          });
        }, {}) || {},
    },
    {
      title: 'Posisi',
      dataIndex: 'hr_position_id',
      render: (_, record) => record.position?.name,
      search: {
        transform: (value) => ({
          hr_position_id: {
            value: value,
            operator: '=',
          },
        }),
      },
      valueEnum:
        positionFilter?.reduce((previousObject, currentObject) => {
          return Object.assign(previousObject, {
            [currentObject.id!]: currentObject.name,
          });
        }, {}) || {},
    },
    {
      title: 'Jenis Pegawai',
      dataIndex: 'hr_employee_type_id',
      render: (_, record) => record.employee_type?.name,
      valueEnum:
        employeeTypeFilter?.reduce((previousObject, currentObject) => {
          return Object.assign(previousObject, {
            [currentObject.id!]: currentObject.name,
          });
        }, {}) || {},
    },
    {
      title: 'Aksi',
      dataIndex: 'option',
      width: '10%',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="show"
          onClick={() => {
            history.push(`/hris/employee/${record.id}`);
          }}
        >
          <EyeOutlined /> Detail
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<EmployeeFeature.EmployeeListItem, API.PageParams>
        headerTitle="Daftar Pegawai"
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 120,
        }}
        request={getEmployee}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCurrentRow(undefined);
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> Tambah
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
      <EmployeeForm
        onSubmit={async () => {
          if (actionRef.current) {
            actionRef.current.reload();
          }
          return true;
        }}
        open={createModalOpen}
        setOpen={handleModalOpen}
      />
    </PageContainer>
  );
};

export default EmployeePage;
