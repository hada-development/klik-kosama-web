import {
  editBankAccount,
  editMember,
  editPersonalData,
  editUserData,
  getMemberAccount,
} from '@/pages/Coop/Member/data/services/service';
import { useState } from 'react';

export type MemberAccount = {
  message: string;
  data: MemberFeature.MemberListItem;
};
export default function useUserMemberAccount(id: number) {
  const [account, setAccount] = useState<MemberAccount>();
  const [loading, setLoading] = useState(false);

  const fetch = async (id: number | string) => {
    console.log('API CALL CALLED');
    setLoading(true);
    const member = await getMemberAccount(id);
    setAccount(member);
    setLoading(false);
  };

  const refresh = async () => {
    if (account != undefined) {
      fetch(account.data.id!);
    }
  };

  const saveData = async (
    memberId: number | string,
    data: { [key: string]: any },
    userId?: number | string,
  ) => {
    setLoading(true);
    if (data.personalData) {
      await editPersonalData(userId, data.personalData);
    }
    if (data.user) {
      try {
        await editUserData(userId, data.user);
      } catch (e: any) {
        console.log(e);
      }
    }
    if (data.bankAccount) {
      await editBankAccount(userId, data.bankAccount);
    } else {
      await editMember(memberId, data);
    }
    fetch(memberId);
  };

  return {
    fetch,
    saveData,
    refresh,
    account,
    loading,
  };
}
