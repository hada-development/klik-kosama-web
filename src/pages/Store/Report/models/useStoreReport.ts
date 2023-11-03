import moment from 'moment';
import { useState } from 'react';

export default () => {
  const currentMonth = moment();
  const currentMonthRange = [currentMonth.startOf('month'), currentMonth.endOf('month')];
  const [dateRange, setDateRange] = useState<any>(currentMonthRange);
  const [storeID, setStoreID] = useState<number>(1);
  return {
    dateRange,
    setDateRange,
    storeID,
    setStoreID,
  };
};
