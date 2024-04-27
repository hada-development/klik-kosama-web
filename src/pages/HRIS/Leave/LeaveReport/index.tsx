import { downloadUrl, formatDateTime } from '@/common/utils/utils';
import { FileExcelOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import React, { useEffect, useRef, useState } from 'react';

import { LeaveReportItem } from '@/pages/HRIS/Leave/LeaveReport/data/data';
import { getLeaveReport } from '@/pages/HRIS/Leave/LeaveReport/data/services/service';
import { Button, Card, DatePicker } from 'antd';

const LeaveReportPage: React.FC = () => {
  const [month, setMonth] = useState<any | null>(null);
  const [monthString, setMonthString] = useState<string | null>(null);

  const actionRef = useRef<ActionType>();

  useEffect(() => {}, []);

  const generateReport = () => {
    if (month === null) {
      alert('Mohon pilih bulan');
      return;
    }
    const year = month.year();
    const selectedMonth = (month.month() + 1).toString().padStart(2, '0');
    setMonthString(`${year}-${selectedMonth}`);
    actionRef?.current?.reload();
  };

  const downloadReport = () => {
    if (month === null) {
      alert('Mohon pilih bulan');
      return;
    }
    const year = month.year();
    const selectedMonth = (month.month() + 1).toString().padStart(2, '0');
    const stringMonth = `${year}-${selectedMonth}`;
    setMonthString(stringMonth);
    downloadUrl(`/api/web/hr/leave/report/excel`, '', {
      month: stringMonth,
    });
  };

  const columns: ProColumns<LeaveReportItem>[] = [
    {
      title: 'Nama',
      dataIndex: ['employee_name'],
    },
    {
      title: 'NIP',
      dataIndex: ['employee_nip'],
    },
    {
      title: 'Jabatan',
      dataIndex: ['position'],
    },
    {
      title: 'Jenis Ketidakhadiran',
      dataIndex: ['leave_type'],
      search: {
        transform: (value) => ({
          leave_type_name: value,
        }), // Set the custom search parameter name
      },
    },
    {
      title: 'Jumlah Hari',
      dataIndex: ['total_days'],
      search: false,
    },
    {
      title: 'Tanggal Mulai',
      dataIndex: 'start_date',
      search: false,
      render: (_, record) => formatDateTime(record.start_date, 'DD/MM/YYYY'),
    },
    {
      title: 'Tanggal Selesai',
      dataIndex: 'end_date',
      search: false,
      render: (_, record) => formatDateTime(record.end_date, 'DD/MM/YYYY'),
    },
    {
      title: 'Keterangan',
      dataIndex: 'note',
      search: false,
    },
  ];

  return (
    <PageContainer>
      <Card>
        <DatePicker.MonthPicker
          placeholder="Pilih Bulan"
          value={month}
          onChange={setMonth}
          style={{ width: '300px', marginRight: '20px' }}
        />
        <Button type="primary" onClick={generateReport}>
          Lihat Rekap
        </Button>

        <Button type="primary" style={{ marginLeft: '8px' }} onClick={downloadReport}>
          <FileExcelOutlined /> Export Rekap
        </Button>
      </Card>
      <ProTable<LeaveReportItem, API.PageParams>
        headerTitle="Rekap Ketidakhadiran"
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 120,
        }}
        request={(params, options) => getLeaveReport(params, options, monthString)}
        columns={columns}
      />
    </PageContainer>
  );
};

export default LeaveReportPage;
