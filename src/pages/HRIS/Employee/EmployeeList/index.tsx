import { ActionType, FooterToolbar, ModalForm, PageContainer, ProColumns, ProFormText, ProTable } from '@ant-design/pro-components';
import React, { useEffect, useRef, useState } from 'react';
import { addEmployee, deleteEmployee, getEmployee } from '../data/services/service';
import { Button, Modal, message } from 'antd';
import { DeleteOutlined, EditOutlined, EyeFilled, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { getPosition } from '@/pages/HRIS/MasterData/Position/data/services/service';
import { getEmployeeType } from '@/pages/HRIS/MasterData/EmployeeType/data/services/service';
import { history } from '@umijs/max';
// import EmployeeForm from './components/EmployeeForm';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRow: EmployeeFeature.EmployeeListItem | undefined) => {
  const hide = message.loading('Mohon Tunggu');
  if (!selectedRow) return true;
  try {
    await deleteEmployee(selectedRow.id);
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error: any) {
    hide();
    var errorMessage: string | undefined = error.response?.data?.message;
    if (errorMessage) {
      message.error(errorMessage);
      return false;
    }
    message.error('Delete failed, please try again');
    return false;
  }
};

const EmployeePage: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<EmployeeFeature.EmployeeListItem | undefined>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, handleDeleteModalOpen] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<EmployeeFeature.EmployeeListItem[]>([]);

  // FILTER
  const [positionFilter, setPositionFilter] = useState<PositionFeature.PositionListItem[]>();
  const [employeeTypeFilter, setEmployeeTypeFilter] = useState<EmployeeTypeFeature.EmployeeTypeListItem[]>();

  useEffect(() =>{
    getPosition({}).then((e) => {
      setPositionFilter(e.data);
    });
    getEmployeeType({}).then((e) => {
      setEmployeeTypeFilter(e.data);
    });
  }, []);

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<EmployeeFeature.EmployeeListItem>[] = [
    {
      title: "Nama Pegawai",
      dataIndex: ["user", "name"],
    },
    {
      title: "NIP",
      dataIndex: "nip",
    },
    {
      title: "Posisi",
      dataIndex: 'hr_position_id',
      render: (_, record) => record.position.name,
      valueEnum: positionFilter?.reduce((previousObject, currentObject) => {
        return Object.assign(previousObject, {
          [currentObject.id!]: currentObject.name
        })
      }, {}) || {}
    },
    {
      title: "Jenis Pegawai",
      dataIndex: 'hr_employee_type_id',
      render: (_, record) => record.employee_type.name,
      valueEnum: employeeTypeFilter?.reduce((previousObject, currentObject) => {
        return Object.assign(previousObject, {
          [currentObject.id!]: currentObject.name
        })
      }, {}) || {}
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
        </a>
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
              Dipilih{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              Item
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
      {/* <EmployeeForm
        onCancel={() => { }}
        onSubmit={async (value) => {
          if (actionRef.current) {
            actionRef.current.reload();
          }
          return true;
        }}
        values={currentRow}
        open={createModalOpen}
        setOpen={handleModalOpen}
      /> */}

      <Modal
        title="Confirm Delete"
        open={deleteModalOpen}
        onCancel={() => handleDeleteModalOpen(false)}
        onOk={async () => {
          await handleRemove(currentRow)
          if (actionRef.current) {
            actionRef.current.reload();
          }
          handleDeleteModalOpen(false);
        }}
      >
        Anda yakin ingin menghapus jabatan ini?
      </Modal>
    </PageContainer>

  );
}

export default EmployeePage;