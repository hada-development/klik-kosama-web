import { formatRupiah } from '@/common/utils/utils';
import { StatisticCard } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';

import savingBlue from '../../../../../../assets/saving_blue.png';
import savingBrown from '../../../../../../assets/saving_brown.png';
import savingGreen from '../../../../../../assets/saving_green.png';
import savingViolet from '../../../../../../assets/saving_violet.png';
import { getCompanySavingSummary } from '../../data/service';

const imgStyle = {
  display: 'block',
  width: 42,
  height: 42,
};

const statisticCardValueStyle = {
  fontSize: '12pt',
  fontWeight: 'bold',
};
type Props = {};

const SavingSummaryCard: React.FC = (props: Props) => {
  const [savingSummary, setSavingSummary] = useState<SavingFeature.SavingSummaryCompany>();

  useEffect(function () {
    getCompanySavingSummary().then((data) => {
      const summary = data.data[0];
      setSavingSummary(summary);
    });
  }, []);

  return (
    <StatisticCard.Group direction={'row'}>
      <StatisticCard
        statistic={{
          title: 'Total Simpanan',
          value: savingSummary?.total_saving ?? 0,
          formatter: formatRupiah,
          valueStyle: statisticCardValueStyle,
          icon: <img style={imgStyle} src={savingBrown} alt="icon" />,
        }}
      />
      <StatisticCard
        statistic={{
          title: 'Simpanan Pokok',
          value: savingSummary?.principal_saving ?? 0,
          formatter: formatRupiah,
          valueStyle: statisticCardValueStyle,
          icon: <img style={imgStyle} src={savingBlue} alt="icon" />,
        }}
      />
      <StatisticCard
        statistic={{
          title: 'Simpanan Wajib',
          value: savingSummary?.mandatory_saving ?? 0,
          formatter: formatRupiah,
          valueStyle: statisticCardValueStyle,
          icon: <img style={imgStyle} src={savingGreen} alt="icon" />,
        }}
      />
      <StatisticCard
        statistic={{
          title: 'Simpanan Sukarela',
          value: savingSummary?.voluntary_saving ?? 0,
          formatter: formatRupiah,
          valueStyle: statisticCardValueStyle,
          icon: <img style={imgStyle} src={savingViolet} alt="icon" />,
        }}
      />
    </StatisticCard.Group>
  );
};

export default SavingSummaryCard;
