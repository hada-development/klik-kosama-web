import { Column, ColumnConfig } from '@ant-design/plots';
import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import { MarginData } from '../../data/data';
import { getMarginChartData } from '../../data/service';

type Props = {};

const MarginChart: React.FC = (props: Props) => {
  const [data, setData] = useState<MarginData[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await getMarginChartData();
    if (response.success) {
      const marginData = response.data;
      setData(marginData);
    }
  };

  const year = new Date().getFullYear();
  const columnChartConfig: ColumnConfig = {
    data,
    isGroup: true,
    xField: 'month',
    yField: 'value',
    seriesField: 'name',

    /** 设置颜色 */
    //color: ['#1ca9e6', '#f88c24'],

    /** 设置间距 */
    // marginRatio: 0.1,
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle',
      // 'top', 'middle', 'bottom'
      // 可配置附加的布局方法
      layout: [
        // 柱形图数据标签位置自动调整
        {
          type: 'interval-adjust-position',
        }, // 数据标签防遮挡
        {
          type: 'interval-hide-overlap',
        }, // 数据标签文颜色自动调整
        {
          type: 'adjust-color',
        },
      ],
    },
  };
  return (
    <Card
      title={
        'Grafik Harga Jual, Beli & Margin Kredit (Dalam Jutaan Rupiah) Tahun ' + year.toString()
      }
    >
      <Column {...columnChartConfig} />
    </Card>
  );
};

export default MarginChart;
