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
import React, { useRef, useState } from 'react';
import { memberStatus, memberType } from '../data/data';
import { getMember } from '../data/services/service';
import MemberForm from './components/MemberForm';

const MemberPage: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<MemberFeature.MemberListItem | undefined>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, handleDeleteModalOpen] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<MemberFeature.MemberListItem[]>([]);

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<MemberFeature.MemberListItem>[] = [
    {
      title: 'No Anggota',
      dataIndex: 'member_no',
    },
    {
      title: 'Nama Anggota',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: ['user', 'email'],
    },
    {
      title: 'Jenis Anggota',
      dataIndex: 'type',
      valueEnum: memberType,
    },
    {
      title: 'Status Anggota',
      dataIndex: 'status',
      valueEnum: memberStatus,
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
            history.push(`/coop/member/${record.id}`);
          }}
        >
          <EyeOutlined /> Detail
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<MemberFeature.MemberListItem, API.PageParams>
        headerTitle="Daftar Anggota"
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 120,
        }}
        scroll={{
          x: 'max-content',
        }}
        request={getMember}
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
      <MemberForm
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

export default MemberPage;
