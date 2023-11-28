import { UserAddOutlined, UserDeleteOutlined, UserOutlined } from '@ant-design/icons';
import { StatisticCard } from '@ant-design/pro-components';
import { Avatar } from 'antd';
import React, { useEffect, useState } from 'react';
import { MemberSummary } from '../../data/data';
import { getMemberSummary } from '../../data/service';

type Props = {};

const statisticCardValueStyle = {
  fontSize: '12pt',
  fontWeight: 'bold',
};

const formatPeople = (value: any) => {
  if (value) {
    return `${value} Orang`;
  }
  return '0 Orang';
};

const MemberSummaryCard: React.FC = (props: Props) => {
  const [data, setData] = useState<MemberSummary | undefined>();

  useEffect(() => {
    getMemberSummary().then((response) => {
      if (response.success) {
        setData(response.data);
      }
    });
  }, []);

  return (
    <StatisticCard.Group>
      <StatisticCard
        statistic={{
          title: 'Total Data Anggota',
          formatter: formatPeople,
          value: data?.all,
          valueStyle: statisticCardValueStyle,
          icon: (
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#9c7f28' }} size={'large'} />
          ),
        }}
      />
      <StatisticCard
        statistic={{
          title: 'Total Anggota Aktif',
          formatter: formatPeople,
          value: data?.active,
          valueStyle: statisticCardValueStyle,
          icon: (
            <Avatar
              icon={<UserAddOutlined />}
              style={{ backgroundColor: '#479f46' }}
              size={'large'}
            />
          ),
        }}
      />
      <StatisticCard
        statistic={{
          title: 'Total Anggota Non Aktif',
          formatter: formatPeople,
          value: data?.inactive,
          valueStyle: statisticCardValueStyle,
          icon: (
            <Avatar
              icon={<UserDeleteOutlined />}
              style={{ backgroundColor: '#9F4747' }}
              size={'large'}
            />
          ),
        }}
      />
    </StatisticCard.Group>
  );
};

export default MemberSummaryCard;
