import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormInstance,
  ProFormItem,
} from '@ant-design/pro-components';

import SearchableSelectInputStandard from '@/common/components/SearchableSelectInput/index-standard';
import { formatDateTime } from '@/common/utils/utils';
import { getEmployee } from '@/pages/HRIS/Employee/data/services/service';
import { Descriptions } from 'antd';
import moment from 'moment';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { addLeaveQuota, editLeaveQuota } from '../data/services/service';

export type LeaveQuotaFormProps = {
  onCancel: (flag?: boolean, formVals?: LeaveQuotaFeature.LeaveQuotaListItem) => void;
  onSubmit: (values: LeaveQuotaFeature.LeaveQuotaListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<LeaveQuotaFeature.LeaveQuotaListItem>;
};

function getPeriod(joinDateStr: string): string[] {
  let joinDate = new Date(joinDateStr);
  joinDate.setFullYear(new Date().getFullYear());

  let startPeriod = moment(joinDate);
  if (startPeriod.isAfter(moment())) {
    startPeriod = startPeriod.subtract(1, 'year');
  }

  let endPeriod = startPeriod.clone().add(1, 'year');
  return [startPeriod.format('DD/MM/YYYY'), endPeriod.format('DD/MM/YYYY')];
}

const LeaveQuotaForm: React.FC<LeaveQuotaFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeFeature.EmployeeListItem | null>(
    null,
  );

  useEffect(() => {
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);
      setSelectedEmployee(props.values!.employee!);
    } else {
      formRef.current?.resetFields();
      setSelectedEmployee(null);
      formRef.current?.setFieldsValue({
        quota: 12,
      });
    }
  }, [props.open, props.values, formRef]);

  const handleSubmit = async (values: LeaveQuotaFeature.LeaveQuotaListItem) => {
    try {
      if (props.values) {
        await editLeaveQuota(props.values.id, values);
      } else {
        await addLeaveQuota(values);
      }
      props.onSubmit(values);
    } catch (error) {
      console.error(error);
    } finally {
      props.onCancel();
    }
  };

  return (
    <ModalForm
      title={props.values !== undefined ? 'Edit Kuota Cuti' : 'Tambah Kuota Cuti'}
      width="400px"
      formRef={formRef}
      open={props.open}
      onOpenChange={props.setOpen}
      onFinish={async (value) => {
        console.log(value);
        await handleSubmit(value);
        props.setOpen!(false);
      }}
    >
      {props.values !== null && props.values !== undefined ? (
        <Descriptions
          layout="vertical"
          items={[
            {
              key: 'name',
              label: 'Nama Pegawai',
              span: 3,
              children: props.values?.employee?.user.name,
            },
            {
              key: 'start_period',
              label: 'Awal Periode',
              children: formatDateTime(props.values?.start_period, 'DD/MM/YYYY'),
            },
            {
              key: 'end_period',
              label: 'Akhir Periode',
              children: formatDateTime(props.values?.end_period, 'DD/MM/YYYY'),
            },
          ]}
        />
      ) : (
        <ProForm.Group>
          <ProFormItem name={'employee_id'} label={'Pilih Pegawai'}>
            <SearchableSelectInputStandard
              placeholder="Cari pegawai (masukkan nama pegawai)"
              onChange={function (selected: any, option: any) {
                setSelectedEmployee(option.employee);
                console.log(option.employee);
              }}
              fetchOptions={async (query) =>
                (
                  await getEmployee({
                    name: query,
                  })
                ).data!.map((employee: any) => {
                  return {
                    value: employee.id,
                    label: `${employee.nip} - ${employee.user.name}`,
                    employee,
                  };
                })
              }
            />
          </ProFormItem>

          {selectedEmployee !== null ? (
            <Descriptions
              layout="vertical"
              items={[
                {
                  key: 'name',
                  label: 'Nama Pegawai',
                  span: 4,
                  children: selectedEmployee!.user!.name,
                },
                {
                  key: 'start_period',
                  label: 'Awal Periode',
                  span: 2,
                  children: getPeriod(selectedEmployee!.join_date!)[0],
                },
                {
                  key: 'end_period',
                  label: 'Akhir Periode',
                  span: 2,
                  children: getPeriod(selectedEmployee!.join_date!)[1],
                },
              ]}
            />
          ) : (
            <></>
          )}
        </ProForm.Group>
      )}

      <ProFormDigit
        rules={[
          {
            required: true,
            message: 'Quota Is Required',
          },
        ]}
        placeholder="Masukkan Quota"
        width="md"
        max={12}
        min={0}
        name="quota"
        label="Quota"
      />
    </ModalForm>
  );
};

export default LeaveQuotaForm;
