// src/pages/MonthlyAttendanceReport.tsx

import { PageContainer } from '@ant-design/pro-layout';
import { Badge, Button, Card, DatePicker, Descriptions, Typography } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
// Adjust the path based on your project structure

const { Text, Link } = Typography;

import SearchableSelectInputStandard from '@/common/components/SearchableSelectInput/index-standard';
import { formatDateTime } from '@/common/utils/utils';
import { getProduct } from '@/pages/Store/Purchase/data/services';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { isNull } from 'lodash';
import { request } from 'umi';
import { getFilteredAndPaginatedData } from './data/services/service';
import { MonthlyAttendanceReportData, MonthlyAttendanceReportMetaData } from './data/typing';

const sharedOnCell = (data: any, _: any) => {
  if (data.attendance == 'absent') {
    return { colSpan: 0 };
  }
  return {};
};

const MonthlyAttendanceReport: React.FC = () => {
  const [employeeId, setEmployeeId] = useState<string | undefined>(undefined);
  const [month, setMonth] = useState<any | null>(null);
  const [reportData, setReportData] = useState<MonthlyAttendanceReportData[]>([]);
  const [metaData, setMetaData] = useState<MonthlyAttendanceReportMetaData>();

  moment.locale('id');

  const generateReport = async () => {
    if (employeeId && month) {
      const year = month.year();
      const selectedMonth = month.month() + 1;

      const response = await getFilteredAndPaginatedData(employeeId, year, selectedMonth);

      console.log(response.data.meta);
      setMetaData(response.data.meta);

      setReportData(response.data.data);
    }
  };

  const exportToPDF = async () => {
    const year = month.year();
    const selectedMonth = month.month() + 1;

    const queryParams = new URLSearchParams({
      employee_id: employeeId ?? '',
      year: year ?? '',
      month: selectedMonth ?? '',
    });

    const exportUrl = `/api/web/hr/attendance/monthly-report/pdf?${queryParams.toString()}`;

    try {
      console.log(exportUrl);
      // Use Umi's request function to get the Excel file
      const response = await request(exportUrl, {
        responseType: 'blob', // Specify the response type as blob
      });

      console.log(response);

      // Check if the response is a valid blob
      if (!(response instanceof Blob)) {
        console.error('Received response is not a Blob:', response);
        return;
      }

      // Create a blob URL and trigger the download
      const blob = new Blob([response], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'attendance_report.pdf';
      link.click();
    } catch (error) {
      console.error('Error while exporting to PDF', error);
    }
  };

  const columns: ProColumns<MonthlyAttendanceReportData>[] = [
    // Define your table columns here
    {
      title: 'Tanggal',
      dataIndex: 'date',
      key: 'date',
      render: (_, record: any) => {
        return (
          <Text type={record.is_weekend || record.is_holiday ? 'danger' : undefined}>
            {formatDateTime(record.date, 'DD/MM/YYYY')}
          </Text>
        );
      },
    },
    {
      title: 'Hari',
      dataIndex: 'date',
      key: 'date',
      render: (_, record: any) => {
        return (
          <Text type={record.is_weekend || record.is_holiday ? 'danger' : undefined}>
            {formatDateTime(record.date, 'dddd')}
          </Text>
        );
      },
    },

    {
      title: 'Jam Masuk',
      dataIndex: 'in_time',
      render: (dom, record: any) => {
        return dom;
      },
      onCell: sharedOnCell,
    },
    {
      title: 'Jam Pulang',
      dataIndex: 'out_time',
      render: (dom, record: any) => {
        return dom;
      },
      onCell: sharedOnCell,
    },
    {
      title: 'Terlambat',
      dataIndex: 'late_minutes',
      render: (_, record: any) => {
        const text = record.late_minutes;
        if (isNull(text) || text == undefined) return '-';
        const number = Math.abs(text);
        return `${Math.floor(number / 60)}h ${number % 60}m`;
      },
      onCell: sharedOnCell,
    },
    {
      title: 'Pulang Cepat',
      dataIndex: 'early_minutes',
      render: (_, record: any) => {
        const text = record.early_minutes;
        if (isNull(text) || text == undefined) return '-';
        const number = Math.abs(text);
        return `${Math.floor(number / 60)}h ${number % 60}m`;
      },
      onCell: sharedOnCell,
    },
    {
      title: 'Durasi Kerja',
      dataIndex: 'work_duration',
      render: (_, record: any) => {
        const text = record.work_duration;
        if (isNull(text) || text == undefined) return '-';
        const number = Math.abs(text);
        return `${Math.floor(number / 60)}h ${number % 60}m`;
      },
      onCell: sharedOnCell,
    },

    {
      title: 'Status',
      dataIndex: 'type',
      valueEnum: {
        normal: { text: 'Normal', status: 'Success' },
        overtime: { text: 'Lembur', status: 'Processing' },
        leave: { text: 'Cuti', status: 'Default' },
        weekend: { text: 'Libur', status: 'Error' },
        absent: { text: 'Alpa', status: 'Error' },
      },
      render: (dom, record: any) => {
        if (record.is_holiday) {
          return <Badge color="red" text={'Libur: ' + record.holiday} />;
        }
        if (record.type == 'leave') {
          return <Badge color="grey" text={'Cuti: ' + record.leave_note} />;
        }
        return dom;
      },
      onCell: (record: any, _) => {
        if (record.attendance == 'absent') {
          return { colSpan: 6 };
        }
        return { colSpan: 1 };
      },
    },
  ];

  const buildHeader = () => {
    if (metaData) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '8pt' }}>Karyawan</span>
            <h4>{metaData.employee_name}</h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '8pt' }}>Periode</span>
            <h4>
              {metaData.start_date} - {metaData.end_date}
            </h4>
          </div>
        </div>
      );
    }
    return <></>;
  };

  return (
    <PageContainer>
      <Card>
        <DatePicker.MonthPicker
          placeholder="Pilih Bulan"
          value={month}
          onChange={setMonth}
          style={{ width: '300px', marginRight: '20px' }}
        />
        <SearchableSelectInputStandard
          placeholder="Cari Karyawan (Ketik Minimal 3 Huruf)"
          onChange={setEmployeeId}
          style={{ width: '300px', marginRight: '20px' }}
          fetchOptions={async (query) =>
            (await getProduct(query)).data!.map((e: any) => {
              return { value: e.id, label: e.user.name };
            })
          }
        />
        <Button type="primary" onClick={generateReport}>
          Generate Report
        </Button>
      </Card>
      <ProTable
        search={false} // Disable built-in search bar as you're using filters
        dateFormatter="string" // Use "string" format for date values
        columns={columns}
        dataSource={reportData}
        rowKey={'date'}
        pagination={false}
        headerTitle={buildHeader()}
        toolBarRender={() => [
          metaData && (
            <Button key="export" onClick={exportToPDF}>
              Export to PDF
            </Button>
          ),
        ]}
      />

      {metaData && (
        <Card>
          <Descriptions title="Ringkasan">
            <Descriptions.Item label="Kehadiran">{metaData.counter.present}</Descriptions.Item>
            <Descriptions.Item label="Cuti">{metaData.counter.leave}</Descriptions.Item>
            <Descriptions.Item label="Alpa">{metaData.counter.absent}</Descriptions.Item>
            <Descriptions.Item label="Terlambat">{metaData.counter.late}</Descriptions.Item>
            <Descriptions.Item label="Total Keterlambatan">{`${Math.floor(
              metaData.counter.late_total / 60,
            )}J ${metaData.counter.late_total % 60}m`}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </PageContainer>
  );
};

export default MonthlyAttendanceReport;
