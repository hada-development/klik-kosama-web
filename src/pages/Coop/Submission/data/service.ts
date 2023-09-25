import { request } from 'umi';
import { Submission } from './data';

const baseUrl = '/api/web/coop/submission';

export async function getSubmissionDetail(id: number): Promise<Submission> {
  const response = await request(`${baseUrl}/${id}`, {
    method: 'GET',
  });
  return response.data;
}

export async function postApproval(id: number, data: any): Promise<void> {
  const formData = new FormData();
  formData.append('status', data.status);
  formData.append('note', data.note);

  Object.keys(data).forEach((key) => {
    // Skip 'status' and 'note' properties
    if (key !== 'status' && key !== 'note') {
      const value = data[key];
      const formKey = `data[${key}]`;
      if (key == 'file') {
        formData.append(formKey, value[0].originFileObj);
      } else {
        // Handle other fields (non-file fields) here
        // Append them to the 'dataFormData' as needed
        formData.append(formKey, value);
      }
    }
  });

  const response = await request(`${baseUrl}/approval/${id}`, {
    method: 'POST',
    data: formData,
  });
  return response.data;
}
