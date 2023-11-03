export const eventTypes = {
  'company-event': { text: 'Acara Perusahaan', status: 'Processing' },
  holiday: { text: 'Libur Nasional', status: 'Success' },
};

export const publishStatuses = {
  draft: { text: 'Draft', status: 'Processing' },
  published: { text: 'Published', status: 'Success' },
  archive: { text: 'Archive', status: 'Default' },
};

export const voucherStatuses = {
  draft: { text: 'Draft', status: 'Processing' },
  published: { text: 'Published', status: 'Success' },
  expired: { text: 'Expired', status: 'Error' },
  used: { text: 'Digunakan', status: 'Default' },
};

export const submissionStatuses = {
  review: { text: 'Review', status: 'Processing' },
  accepted: { text: 'Diterima', status: 'Success' },
  rejected: { text: 'Ditolak', status: 'Error' },
};

export const webRoles = ['admin', 'management', 'staff'];

export interface PaginationList<TData> {
  current_page: number;
  total: number;
  data: TData[];
}

export interface ResponseData<TData> {
  status: string;
  message: string;
  success?: boolean;
  data: TData;
}

export interface File {
  id: number;
  name: string;
  type: string;
  is_temporary: boolean;
  address: string;
  thumbnail: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: any;
  profile_photo_file_id: any;
  verification_status: string;
  created_at: string;
  updated_at: string;
  member?: Member;
}

export interface Member {
  id: number;
  name: string;
  member_no: string;
  type: string;
  status: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface Savings {
  member_id: number;
  member_name: string;
  member_no: string;
  member_type: string;
  member_status: string;
  total_saving: number;
  principal_saving: number;
  mandatory_saving: number;
  voluntary_saving: number;
  voluntary_withdrawal: number;
}
