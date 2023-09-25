export const publishStatuses = {
  draft: { text: 'Draft', status: 'Processing' },
  published: { text: 'Published', status: 'Success' },
  archive: { text: 'Archive', status: 'Default' },
};

export const submissionStatuses = {
  review: { text: 'Review', status: 'Processing' },
  accepted: { text: 'Diterima', status: 'Success' },
  rejected: { text: 'Ditolak', status: 'Error' },
};

export const webRoles = ['admin', 'management', 'staff'];

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
