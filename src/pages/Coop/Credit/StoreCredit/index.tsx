import { formatRupiah } from '@/common/utils/utils';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { DatePicker, message } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import ExcelImportModal from '../../Shared/Components/ExcelImportModal';
import { StoreCreditListItem } from './data/data';
import { getStoreLoanDataTable } from './data/service';

const StoreCreditListPage: React.FC = () => {
  const currentMonth = moment();
  const currentMonthRange = [currentMonth.startOf('year'), currentMonth.endOf('year')];

  const [dMonthRange, setDMonthRange] = useState<any>(currentMonthRange);
  const [monthRange, setMonthRange] = useState<any>(
    currentMonthRange.map((e) => e.format('YYYY-MM')),
  );
  const [months, setMonths] = useState<any[]>([]);
  const [importModalOpen, handleImportModalOpen] = useState<boolean>(false);

  useEffect(() => {
    console.log(dMonthRange);
    if (dMonthRange != null) {
      if (dMonthRange.length == 2) {
        setMonthRange(dMonthRange.map((e: any) => e.format('YYYY-MM')));
      }
    }
  }, [dMonthRange]);

  useEffect(() => {
    let currentMonth = monthRange[0];
    var monthin = [];
    while (currentMonth <= monthRange[1]) {
      monthin.push(currentMonth);
      const date = new Date(currentMonth + '-01');
      date.setMonth(date.getMonth() + 1);
      currentMonth = date.toISOString().slice(0, 7);
    }
    console.log(currentMonth <= monthRange[1]);

    setMonths(monthin);
    actionRef.current?.reloadAndRest?.();
  }, [monthRange]);

  const actionRef = useRef<ActionType>();

  function navigateDetail(id: number) {
    history.push(`/coop/credit/store/${id}`);
  }

  const columns: ProColumns<StoreCreditListItem>[] = [
    {
      title: 'No Anggota',
      dataIndex: 'member_no',
    },
    {
      title: 'Anggota',
      dataIndex: 'name',
    },
    ...months.map(
      (month: string) =>
        ({
          title: moment(month, 'YYYY-MM').format('MMM YYYY'),
          dataIndex: `amount_${month.replace('-', '_')}`,
          key: month,
          search: false,
          width: '150px',
          align: 'right' as 'right',
          render: (text: any) => {
            return formatRupiah(text);
          },
        } as any),
    ),

    // {
    //   title: 'Aksi',
    //   dataIndex: 'option',
    //   valueType: 'option',
    //   // width: '80px',
    //   render: (_, record) => [
    //     <a
    //       key="show"
    //       onClick={() => {
    //         navigateDetail(record.id);
    //       }}
    //     >
    //       <EyeOutlined /> Lihat
    //     </a>,
    //   ],
    // },
  ];
  return (
    <PageContainer>
      <ProTable<StoreCreditListItem, API.PageParams>
        headerTitle="Daftar Hutang Toko"
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 200,
        }}
        toolbar={{
          actions: [
            <DatePicker.RangePicker
              value={dMonthRange}
              onChange={(values) => setDMonthRange(values)}
              picker="month"
            />,
          ],
        }}
        request={(params, options) =>
          getStoreLoanDataTable(
            params,
            {
              store_id: 1,
              month_range: monthRange,
            },
            options,
          )
        }
        columns={columns}
        scroll={{
          x: 'max-content',
        }}
      />

      <ExcelImportModal
        isModalOpen={importModalOpen}
        setIsModalOpen={handleImportModalOpen}
        url="/api/web/coop/credit/payment/import"
        templateUrl="/api/web/coop/credit/payment/export"
        title="Import Pembayaran"
        onUploaded={() => {
          message.success('Berhasil mengimport transaksi simpanan');
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }}
      />
    </PageContainer>
  );
};

export default StoreCreditListPage;
