import { formatTableParams } from '@/common/utils/utils';
import { request } from 'umi';

// ========== Saving Summary
export async function getSavingSummaryTable(params: any, options?: { [key: string]: any }) {
  try {
    const formattedParams = formatTableParams(params);
    console.log(formattedParams);
    let response = await request('/api/web/coop/saving/summary', {
      method: 'GET',
      params: {
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

export async function getCompanySavingSummary() {
  return request(`/api/web//coop/saving/summary/summary`, {
    method: 'GET',
  });
}

const savingTransactionBaseUrl = '/api/web/coop/saving/transaction';

/**
 * Saving Transaction APIs
 */

export async function getSavingTransactionTable(params: any, options?: { [key: string]: any }) {
  try {
    const formattedParams = formatTableParams(params);
    console.log(formattedParams);
    let response = await request(savingTransactionBaseUrl, {
      method: 'GET',
      params: {
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
