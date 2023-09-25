import SearchableSelectInputStandard from '@/common/components/SearchableSelectInput/index-standard';
import { SearchOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, DatePicker, Image } from 'antd';
import { isNull } from 'lodash';
import { useRef, useState } from 'react';
import { request } from 'umi';
import { getEmployee } from '../../Employee/data/services/service';
import { getShift } from '../../MasterData/Shift/data/services/service';
import { getFilteredAttendanceData } from './service/service'; // Replace with your API function
import { AttendanceTableRow } from './service/typing';

const AttendanceTable = () => {
  const [employeeFilter, setEmployeeFilter] = useState(null);
  const [shiftFilter, setShiftFilter] = useState(null);
  const [dateRangeFilter, setDateRangeFilter] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [showImage, setShowImage] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const handleEmployeeFilterChange = (value: any) => {
    setEmployeeFilter(value);
    actionRef.current?.reloadAndRest?.();
  };

  const handleShiftFilterChange = (value: any) => {
    setShiftFilter(value);
    actionRef.current?.reloadAndRest?.();
  };

  const handleDateRangeChange = (dates: any) => {
    console.log(dates[0]);
    setDateRangeFilter(dates);
    actionRef.current?.reloadAndRest?.();
  };

  const handleShowImage = (url: string) => {
    setSelectedImage(url);
    setShowImage(true);
  };

  const exportToExcel = async () => {
    const queryParams = new URLSearchParams({
      hr_employee_id: employeeFilter ?? '',
      start_date: dateRangeFilter[0] ?? '',
      end_date: dateRangeFilter[1] ?? '',
    });

    const exportUrl = `/api/web/hr/attendance/export-excel?${queryParams.toString()}`;

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
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'attendance_report.xlsx';
      link.click();
    } catch (error) {
      console.error('Error while exporting to Excel', error);
    }
  };

  const columns: ProColumns<AttendanceTableRow>[] = [
    {
      title: 'Tanggal',
      dataIndex: 'date',
      width: 100,
    },
    {
      title: 'Pegawai',
      width: 240,
      dataIndex: 'employee_data',
      render: (_: any, record: any) => `${record.employee_data.name} (${record.employee_data.nip})`,
      filters: true,
      onFilter: true,
      filterDropdown: (
        <SearchableSelectInputStandard
          placeholder="Cari Pegawai (Ketik Minimal 3 Huruf)"
          onChange={handleEmployeeFilterChange}
          fetchOptions={async (query) =>
            (await getEmployee({ name: query })).data!.map((e: any) => {
              return { value: e.id, label: e.user.name };
            })
          }
        />
      ),
      filterIcon: <SearchOutlined />,
    },
    {
      title: 'Jenis',
      dataIndex: 'type',
      width: 120,
      valueEnum: {
        normal: { text: 'Normal', status: 'Success' },
        overtime: { text: 'Lembur', status: 'Processing' },
        leave: { text: 'Cuti', status: 'Default' },
      },
      filters: [
        { text: 'Normal', value: 'normal' },
        { text: 'Lembur', value: 'overtime' },
        { text: 'Cuti', value: 'leave' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Shift',
      dataIndex: ['shift_data', 'name'],
      width: 120,
      filters: true,
      onFilter: true,
      filterDropdown: (
        <SearchableSelectInputStandard
          placeholder="Cari Shift (Ketik Minimal 3 Huruf)"
          onChange={handleShiftFilterChange}
          fetchOptions={async (query) =>
            (await getShift({ name: query })).data!.map((e: any) => {
              return { value: e.id, label: e.name };
            })
          }
        />
      ),
      filterIcon: <SearchOutlined />,
    },
    {
      title: 'Shift Masuk',
      width: 120,
      dataIndex: ['shift_data', 'start_time'],
    },
    {
      title: 'Shift Pulang',
      width: 120,
      dataIndex: ['shift_data', 'end_time'],
    },
    {
      title: 'Jam Masuk',
      width: 120,
      dataIndex: 'in_time',
      render: (dom, record: any) => {
        console.log(record);
        if (record.in_image_url) {
          return (
            <a
              onClick={() => {
                handleShowImage(record.in_image_url);
              }}
            >
              {dom}
            </a>
          );
        }
      },
    },
    {
      title: 'Jam Pulang',
      width: 120,
      dataIndex: 'out_time',
      render: (dom, record: any) => {
        console.log(record);
        if (record.out_image_url) {
          return (
            <a
              onClick={() => {
                handleShowImage(record.out_image_url);
              }}
            >
              {dom}
            </a>
          );
        }
      },
    },
    {
      title: 'Terlambat',
      width: 120,
      dataIndex: 'late_minutes',
      render: (_, record: any) => {
        const text = record.late_minutes;
        if (isNull(text)) return '-';
        const number = Math.abs(text);
        return `${Math.floor(number / 60)}h ${number % 60}m`;
      },
    },
    {
      title: 'Pulang Cepat',
      width: 120,
      dataIndex: 'early_minutes',
      render: (_, record: any) => {
        const text = record.early_minutes;
        if (isNull(text)) return '-';
        const number = Math.abs(text);
        return `${Math.floor(number / 60)}h ${number % 60}m`;
      },
    },
    {
      title: 'Durasi Kerja',
      width: 100,
      dataIndex: 'work_duration',
      render: (_, record: any) => {
        const text = record.work_duration;
        if (isNull(text)) return '-';
        const number = Math.abs(text);
        return `${Math.floor(number / 60)}h ${number % 60}m`;
      },
    },
  ];

  return (
    <PageContainer>
      <div style={{ width: '100%', overflowX: 'scroll' }}>
        <ProTable
          columns={columns}
          actionRef={actionRef}
          request={async (params, sorter, filter) => {
            const response = await getFilteredAttendanceData({
              ...params,
              ...filter,
              hr_employee_id: employeeFilter,
              hr_shift_id: shiftFilter,
              start_date: dateRangeFilter[0]?.format('YYYY-MM-DD'),
              end_date: dateRangeFilter[1]?.format('YYYY-MM-DD'),
            });
            return {
              data: response.data,
              success: true,
              total: response.total,
            };
          }}
          pagination={{
            pageSize: 20,
          }}
          search={false} // Disable built-in search bar as you're using filters
          dateFormatter="string" // Use "string" format for date values
          headerTitle="Attendance Report"
          toolBarRender={() => [
            <DatePicker.RangePicker
              format="YYYY-MM-DD"
              key="dateRange"
              onChange={handleDateRangeChange}
            />,
            <Button key="export" onClick={exportToExcel}>
              Export to Excel
            </Button>,
          ]}
          rowKey="id"
          scroll={{ x: 'max-content' }} // Set the x scroll value to 'max-content'
          sticky={true} // Enable sticky columns
        />
      </div>
      <Image
        width={200}
        style={{ display: 'none' }}
        src={selectedImage}
        preview={{
          visible: showImage,
          src: selectedImage,
          onVisibleChange: (value) => {
            setShowImage(value);
          },
        }}
      />
    </PageContainer>
  );
};

export default AttendanceTable;
