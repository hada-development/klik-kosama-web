import { File, User } from '@/common/data/data';

export type InformationTableItem = {
  id: number;
  created_by: User;
  title: string;
  content: string;
  file_id: number;
  status: string;
  image: File;
  created_at: string;
};
