import { isObject } from 'lodash';
import moment from 'moment';

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
): string {
  if (dateTime == undefined) {
    return '';
  }
  if (dateTime instanceof Date) {
    return moment(dateTime).format(format);
  }

  return moment(dateTime, 'YYYY-MM-DD').format(format);
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
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}
