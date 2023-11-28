import { useModel } from '@umijs/max';
import { Button, DatePicker, Flex, Select } from 'antd';
import React, { useState } from 'react';

interface DateRangePickerProps {}

const DateRangePicker: React.FC<DateRangePickerProps> = () => {
  const { dateRange, setDateRange, storeID, setStoreID } = useModel('Store.Report.useStoreReport');
  const [localDateRange, setLocalDateRange] = useState<any>(dateRange);

  const changeDateRange = (values: any) => {
    setLocalDateRange(values);
  };

  const handleGenerateReport = () => {
    setDateRange(localDateRange);
  };

  return (
    <Flex gap={'small'}>
      <DatePicker.RangePicker value={localDateRange} onChange={changeDateRange} />
      <Select
        options={[
          {
            label: 'KOSAMART',
            value: 1,
          },
          {
            label: 'APOTEK',
            value: 2,
          },
        ]}
        value={storeID}
        onChange={setStoreID}
      />
      <Button type="primary" onClick={handleGenerateReport}>
        Generate Report
      </Button>
    </Flex>
  );
};

export default DateRangePicker;
