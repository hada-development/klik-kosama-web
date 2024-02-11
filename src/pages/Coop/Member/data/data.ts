export const maritalStatuses = [
  { value: 'marriage', label: 'Menikah' },
  { value: 'single', label: 'Belum Menikah' },
];

export const religions = [
  { value: 'Islam', label: 'Islam' },
  { value: 'Protestan', label: 'Protestan' },
  { value: 'Katolik', label: 'Katolik' },
  { value: 'Hindu', label: 'Hindu' },
  { value: 'Buddha', label: 'Buddha' },
  { value: 'Khonghucu', label: 'Khonghucu' },
];

export const genders = [
  { value: 'male', label: 'Laki-Laki' },
  { value: 'female', label: 'Perempuan' },
];

export const memberStatus = {
  active: { text: 'Aktif', status: 'Success' },
  inactive: { text: 'Non Aktif', status: 'Error' },
  pending: { text: 'Menunggu', status: 'Processing' },
  rejected: { text: 'Ditolak', status: 'Error' },
};

export const memberType = {
  AB: { text: 'AB', status: 'Success' },
  ALB: { text: 'ALB', status: 'Warning' },
  'NON AKTIF': { text: 'NON AKTIF', status: 'Error' },
};

export type MemberSaving = {
  member_no: string;
  member_id: number;
  saving_type: string;
  transaction_type: string;
  month: number;
  year: number;
  amount: number;
  note: string;
  created_at: string;
};
