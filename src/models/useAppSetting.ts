
import { useRequest } from 'umi';
import { getAppSetting } from '@/common/services/demo/demo';

export default function useAppSetting(params: { pageSize: number; current: number }) {
    const appSetting = useRequest(() => getAppSetting(params));

  
    return {
      appSetting: appSetting.data,
      loading: appSetting.loading,
      reload: appSetting.run,
    };
  }