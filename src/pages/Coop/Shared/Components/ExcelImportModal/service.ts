import { request } from 'umi';

export async function importExcel(
  file: File,
  url: string,
  param: string = 'file',
  data?: { [key: string]: any },
) {
  try {
    const formData = new FormData();
    formData.append(param, file);
    if (data) {
      Object.entries(data).forEach(([key, value], index) => {
        formData.append(key, value);
      });
    }

    let response = await request(url, {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (e) {
    throw e;
  }
}
