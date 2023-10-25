import { request } from '@umijs/max';

const baseUrl = '/api/web/coop/credit';

export async function addPayment(credit_id: number, data: any) {
  return request(`${baseUrl}/${credit_id}/payment`, {
    method: 'POST',
    data: data,
  });
}

export async function editPayment(credit_id: number, payment_id: number, data: any) {
  return request(`${baseUrl}/${credit_id}/payment/${payment_id}`, {
    method: 'PUT',
    data: data,
  });
}
