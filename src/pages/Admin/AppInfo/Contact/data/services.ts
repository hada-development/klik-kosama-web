import { request } from 'umi';
import { ContactType } from '../../data/data';

const baseUrl = '/api/web/admin/info/contact';

export async function getContact(): Promise<ContactType> {
  try {
    const response = await request(baseUrl, {
      method: 'GET',
    });
    return response.data as ContactType;
  } catch (e: any) {
    throw e;
  }
}

export async function setContact(data: ContactType): Promise<void> {
  await request(baseUrl, {
    method: 'PUT',
    data: data,
  });
}
