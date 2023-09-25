import { publishStatuses } from '@/common/data/data';
import { formatDateTime } from '@/common/utils/utils';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'umi';
import { getAdjustmentDetail } from '../services/service';
import AllowanceTable from './AllowanceTable/show';
import BasicSalaryTable from './BasicSalaryTable/show';

const AdjustmentDetail: React.FC = () => {
  const [adjustmentMeta, setAdjustmentMeta] = useState<AdjustmentFeature.AdjustmentListItem>();
  const [details, setDetails] = useState<any[]>();
  const { adjustmentId } = useParams<{ adjustmentId: string }>();

  useEffect(() => {
    if (adjustmentId == undefined) {
      return;
    }
    getAdjustmentDetail(adjustmentId)
      .then((data) => {
        setDetails(data.data.details);
        setAdjustmentMeta(data.data);
        // setDetails(data.data);
      })
      .catch((error) => {
        console.error('Error fetching position levels:', error);
      });
  }, []);

  return (
    <PageContainer>
      <Card title={'Detail Adjustment ' + (adjustmentMeta?.payroll_component.name ?? '')}>
        <ProDescriptions>
          <ProDescriptions.Item label="Judul"> {adjustmentMeta?.title} </ProDescriptions.Item>
          <ProDescriptions.Item label="Tanggal Efektif">
            {' '}
            {formatDateTime(adjustmentMeta?.effective_date!, 'DD/MM/YYYY')}{' '}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Status" valueEnum={publishStatuses}>
            {adjustmentMeta?.status}
          </ProDescriptions.Item>
        </ProDescriptions>
        {adjustmentMeta?.payroll_component &&
          {
            'basic-salary': <BasicSalaryTable details={details} />,
            allowance: <AllowanceTable details={details} />,
          }[adjustmentMeta!.payroll_component!.type!]}
      </Card>
    </PageContainer>
  );
};

export default AdjustmentDetail;
