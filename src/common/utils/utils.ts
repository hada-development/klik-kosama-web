import { isObject } from 'lodash';
import moment from 'moment';
import { request } from 'umi';
import { PaginationList } from '../data/data';

export const getImageUrl = (path: string | undefined) => {
  if (path == undefined) {
    return null;
  }
  if (path.includes('http')) {
    return path;
  }
  return path;
};

export const formatTableParams = (params: { [key: string]: any }) => {
  let newParams: { [key: string]: any } = {
    page: params.current,
    page_size: params.pageSize,
  };

  let search: { [key: string]: string } = (({ current, pageSize, ...o }) => o)(params);
  Object.entries(search).forEach(([key, value]) => {
    if (isObject(value)) {
      Object.entries(value).forEach(([key1, value1]) => {
        newParams[`search[${key}][${key1}]`] = value1;
      });
    } else {
      newParams[`search[${key}]`] = value;
    }
  });

  return newParams;
};

export const formatPhoneNumber = (value: string) => {
  value = value.replace(/\D/g, ''); // Remove non-numeric characters
  if (value.length <= 3) {
    return value;
  } else if (value.length <= 7) {
    return `(${value.slice(0, 3)}) ${value.slice(3)}`;
  } else {
    return `${value.slice(0, 4)}-${value.slice(4, 8)}-${value.slice(8, 15)}`;
  }
};

export function formatDateTime(
  dateTime: Date | string | undefined,
  format: string = 'YYYY-MM-DD HH:mm:ss',
  baseFormat: string = 'YYYY-MM-DD',
): string {
  if (dateTime == undefined) {
    return '';
  }
  if (dateTime instanceof Date) {
    return moment(dateTime).format(format);
  }

  return moment(dateTime, baseFormat).format(format);
}

export function convertValueEntryToOptions(valueEntry: any) {
  return Object.entries(valueEntry).map(([k, v]: [string, any], i) => {
    return {
      value: k,
      label: v.text,
    };
  });
}

export function formatRupiah(value: any): string {
  if (value == undefined || value.length == 0) {
    return '-';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export const formatPrice = (price: number, pad: number = 10, locale = true) => {
  // Right-align the price within a 10-character width
  if (!locale) {
    return price.toFixed(0).padStart(pad, '\u00A0');
  }
  return price.toLocaleString(undefined, { minimumFractionDigits: 0 }).padStart(pad, '\u00A0');
};

export function isNumber(value: any): boolean {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function convertToHourMinute(minutes: number): string {
  const jam = Math.floor(minutes / 60);
  const menit = minutes % 60;

  const jamString = jam > 0 ? `${jam} Jam` : '';
  const menitString = menit > 0 ? `${menit} Menit` : '';

  // Join the strings with a space in between
  const result = [jamString, menitString].filter(Boolean).join(' ');

  return result || '0 Menit'; // Return '0 Menit' if the result is empty
}

export const isoDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSSSSZ';

export function isImageFile(fileName: string) {
  // Define a list of common image file extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'];

  // Get the file extension from the fileName
  const fileExtension = fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2);

  // Check if the file extension is in the list of image extensions
  return imageExtensions.includes(`.${fileExtension.toLowerCase()}`);
}

function getFilenameFromUrl(url: string) {
  // Use a regular expression to capture the filename from the URL.
  const match = url.match(/\/([^/]+)$/);

  // Check if a match was found and return the captured filename.
  if (match && match.length > 1) {
    return match[1];
  } else {
    // If no match was found, return null or an appropriate default value.
    return '';
  }
}

export async function downloadUrl(url: string, filename?: string | null, params?: null) {
  console.log('APP PARAMS');
  console.log(params);
  // Make a request to fetch the file.
  const response = await request(url, {
    responseType: 'blob', // Set the responseType to 'blob' to handle binary data.
    method: 'GET', // Use the appropriate HTTP method (e.g., GET) for your API.
    params: params,
  });

  // Create a URL for the blob data.
  const blobUrl = window.URL.createObjectURL(response);

  // Create a temporary anchor element to trigger the download.
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename ?? getFilenameFromUrl(url); // Specify the filename for the downloaded file.
  a.style.display = 'none';

  // Append the anchor element to the document and trigger the click event.
  document.body.appendChild(a);
  a.click();

  // Clean up by removing the temporary anchor element and revoking the blob URL.
  document.body.removeChild(a);
  window.URL.revokeObjectURL(blobUrl);
}

export async function requestTableData<TData>(
  url: string,
  params: any,
  options?: { [key: string]: any },
  rawQuery?: { [key: string]: any },
): Promise<PaginationList<TData>> {
  try {
    const formattedParams = formatTableParams(params);
    let response = await request(url, {
      method: 'GET',
      params: {
        ...rawQuery,
        ...formattedParams,
      },
      ...(options || {}),
    });

    return {
      current_page: response.current_page,
      data: response.data,
      total: response.total,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
}
