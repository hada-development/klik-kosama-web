import { getPositionLevel } from '@/pages/HRIS/MasterData/PositionLevel/data/services/service';
import { Table } from 'antd';
import React, { useEffect, useState } from 'react';

type AllowanceTableProp = {
  details?: any[];
};

const AllowanceTable: React.FC<AllowanceTableProp> = ({ details }) => {
  const [positionLevels, setPositionLevels] = useState<
    PositionLevelFeature.PositionLevelListItem[]
  >([]);

  useEffect(() => {
    getPositionLevel({})
      .then((data) => {
        setPositionLevels(data.data);
      })
      .catch((error) => {
        console.error('Error fetching position levels:', error);
      });
  }, []);

  const columns = [
    ...positionLevels.map((level) => ({
      title: level.name,
      dataIndex: 'position_level_' + level.id?.toString(),
      width: 200,
      render: (data: any, record: any) => {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0,
        }).format(data);
      },
    })),
  ];

  return (
    <Table
      loading={details == undefined}
      bordered
      dataSource={details}
      columns={columns}
      pagination={false}
      rowKey="years"
    />
  );
};

export default AllowanceTable;
