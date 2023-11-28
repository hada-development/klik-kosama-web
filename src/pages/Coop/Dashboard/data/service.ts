import { ResponseData } from '@/common/data/data';
import { request } from 'umi';
import { MarginData, MemberSummary } from './data';

export async function getMarginChartData(): Promise<ResponseData<MarginData[]>> {
  return request('/api/web/coop/dashboard/margin-chart', {
    method: 'GET',
  });
}

export async function getMemberSummary(): Promise<ResponseData<MemberSummary>> {
  return request('/api/web/coop/dashboard/member-summary', {
    method: 'GET',
  });
}
