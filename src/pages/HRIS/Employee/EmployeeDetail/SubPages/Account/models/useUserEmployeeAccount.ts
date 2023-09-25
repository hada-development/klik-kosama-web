import {
  editBankAccount,
  editEmployee,
  editPersonalData,
  getEmployeeAccount,
} from '@/pages/HRIS/Employee/data/services/service';
import { useState } from 'react';

export type EmployeeAccount = {
  message: string;
  data: EmployeeFeature.EmployeeListItem;
};

export default function useUserEmployeeAccount(id: number) {
  const [account, setAccount] = useState<EmployeeAccount>();
  const [loading, setLoading] = useState(false);

  const fetch = async (id: number | string) => {
    console.log('API CALL CALLED');
    setLoading(true);
    const employee = await getEmployeeAccount(id);
    setAccount(employee);
    setLoading(false);
  };

  const refresh = async () => {
    if (account != undefined) {
      fetch(account.data.id!);
    }
  };

  const saveData = async (
    employeeId: number | string,
    data: { [key: string]: any },
    userId?: number | string,
  ) => {
    setLoading(true);
    if (data.personalData) {
      await editPersonalData(userId, data.personalData);
    }
    if (data.bankAccount) {
      await editBankAccount(userId, data.bankAccount);
    } else {
      await editEmployee(employeeId, data);
    }
    fetch(employeeId);
  };

  return {
    fetch,
    saveData,
    refresh,
    account,
    loading,
  };
}
