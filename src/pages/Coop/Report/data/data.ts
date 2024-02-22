import { publishStatuses } from '@/common/data/data';

export type ReportModel = {
  id: number;
  title: string;
  year: number;
  status: keyof typeof publishStatuses;
  file: {
    id: number;
    name: string;
    address: string;
  };
};
