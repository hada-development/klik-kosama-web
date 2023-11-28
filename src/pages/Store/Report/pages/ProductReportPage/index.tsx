import { downloadUrl, formatRupiah, formatTableParams } from '@/common/utils/utils';
import { FileExcelOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumnType, ProTable } from '@ant-design/pro-components';
import { Button, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import DateRangePicker from '../../components/DateRangePicker';
import { ProductSale } from '../../data/data';
import { ReportRequestProp, getProductReportDataTable } from '../../data/services';

type Props = {};

const ProductReportPage = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tableParam, setCurrentParam] = useState<any>();

  const { dateRange } = useModel('Store.Report.useStoreReport');
  const { storeID } = useModel('Store.useStore');

  const actionRef = useRef<ActionType>();

  const [queryParam, setQueryParam] = useState<ReportRequestProp>({
    store_id: storeID,
    date_range: dateRange.map((date: any) => date?.format('YYYY-MM-DD')),
  });

  const columns: ProColumnType<ProductSale>[] = [
    {
      title: 'SKU',
      dataIndex: 'product_sku',
    },
    {
      title: 'Nama Produk',
      dataIndex: 'product_name',
    },
    {
      title: 'Jumlah Terjual',
      dataIndex: 'total_item',
      search: false,
    },
    {
      title: 'Nominal Terjual',
      dataIndex: 'total_sale',
      align: 'right',
      search: false,
      render: (text: any) => {
        return formatRupiah(text);
      },
    },
  ];

  useEffect(() => {
    handleGenerateReport();
  }, [dateRange, storeID]);

  const handleGenerateReport = async () => {
    if (dateRange && dateRange.length === 2) {
      const param = {
        store_id: storeID,
        date_range: dateRange.map((date: any) => date?.format('YYYY-MM-DD')),
      };
      setQueryParam(param);
      actionRef.current?.reloadAndRest?.();
    }
  };

  return (
    <PageContainer
      header={{
        title: 'Laporan Transaksi',
      }}
      extra={<DateRangePicker />}
    >
      <Spin spinning={loading}>
        <ProTable<ProductSale>
          actionRef={actionRef}
          headerTitle={'Penjualan Produk'}
          columns={columns}
          request={(params: any, options: any) => {
            setCurrentParam(formatTableParams(params));
            return getProductReportDataTable(params, queryParam, options);
          }}
          search={{
            labelWidth: 150,
          }}
          rowKey={'id'}
          toolBarRender={() => [
            <Button
              type="primary"
              key="1"
              onClick={() => {
                downloadUrl('/api/web/store/report/product/export', 'penjualan_produk.xlsx', {
                  ...tableParam,
                  ...queryParam,
                });
              }}
            >
              <FileExcelOutlined /> Export Excel
            </Button>,
          ]}
        />
      </Spin>
    </PageContainer>
  );
};

export default ProductReportPage;
