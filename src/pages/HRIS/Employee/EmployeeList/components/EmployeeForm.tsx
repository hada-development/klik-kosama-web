import { getCompany } from '@/pages/HRIS/MasterData/Company/data/services/service';
import { getEducationLevel } from '@/pages/HRIS/MasterData/EducationLevel/data/services/service';
import { getEmployeeType } from '@/pages/HRIS/MasterData/EmployeeType/data/services/service';
import { getOffice } from '@/pages/HRIS/MasterData/Office/data/services/service';
import { getPosition } from '@/pages/HRIS/MasterData/Position/data/services/service';
import { getShift } from '@/pages/HRIS/MasterData/Shift/data/services/service';
import {
  DrawerForm,
  ProForm,
  ProFormDatePicker,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Divider, message } from 'antd';
import React, { Dispatch, SetStateAction, useRef } from 'react';
import { history } from 'umi';
import { addEmployee } from '../../data/services/service';

export type EmployeeFormProps = {
  onSubmit: () => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const EmployeeForm: React.FC<EmployeeFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();
  const handleSubmit = async (value: { [key: string]: any }) => {
    const data = {
      user: {
        name: value.name,
        email: value.email,
        password: value.password,
        password_confirmation: value.password_confirmation,
      },
      employee: {
        hr_employee_type_id: value.hr_employee_type_id,
        hr_position_id: value.hr_position_id,
        hr_office_id: value.hr_office_id,
        hr_company_id: value.hr_company_id,
        nip: value.nip,
        hr_education_level_id: value.hr_education_level_id,
        education_note: value.education_note || null,
        join_date: value.join_date,
        hr_shift_id: value.hr_shift_id,
      },
    };

    try {
      const newEmployee = await addEmployee(data);
      console.log(newEmployee);
      if (newEmployee.success) {
        props.onSubmit();
        message.success('Data Pegawai Berhasil Dibuat');
        const id = newEmployee.data.id;
        history.push(`/hris/employee/${id}`);
      }
      return true;
    } catch (e: any) {
      console.log(e);
      if (e.response?.data?.message) {
        message.error(e.response?.data?.message);
      }
      return false;
    }
  };

  const onOpenChange = (flag: boolean) => {
    if (!flag) {
      formRef.current?.resetFields();
    }
    props.setOpen(flag);
  };

  return (
    <DrawerForm
      formRef={formRef}
      onOpenChange={onOpenChange}
      title="Tambah Pegawai"
      open={props.open}
      onFinish={handleSubmit}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          label="Nama"
          placeholder="Masukkan Nama"
          rules={[
            {
              required: true,
              message: 'Nama wajib diisi',
            },
          ]}
        />
        <ProFormText
          width="md"
          name="nip"
          label="NIP (Nomor Induk Pegawai)"
          placeholder="Masukkan NIP"
          rules={[
            {
              required: true,
              message: 'NIP wajib diisi',
            },
          ]}
        />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="hr_company_id"
          label="Instansi"
          placeholder="Pilih Instansi"
          request={async () =>
            (await getCompany({})).data.map((e: any) => {
              return { value: e.id, label: e.name };
            })
          }
          rules={[{ required: true, message: 'Instansi wajib diisi' }]}
        />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="hr_employee_type_id"
          label="Jenis Pegawai"
          placeholder="Pilih Jenis Pegawai"
          request={async () =>
            (await getEmployeeType({})).data.map((e) => {
              return { value: e.id, label: e.name };
            })
          }
          rules={[{ required: true, message: 'Jenis Pegawai wajib diisi' }]}
        />
        <ProFormSelect
          width="md"
          name="hr_position_id"
          label="Posisi"
          placeholder="Pilih Posisi Pegawai"
          request={async () =>
            (await getPosition({})).data.map((e: any) => {
              return { value: e.id, label: e.name };
            })
          }
          rules={[{ required: true, message: 'Posisi Pegawai wajib diisi' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDatePicker
          width="md"
          name="join_date"
          label="Tanggal Masuk"
          placeholder="Masukkan Tanggal Masuk"
          rules={[
            {
              required: true,
              message: 'Tanggal Masuk wajib diisi',
            },
          ]}
        />
        <ProFormDatePicker
          width="md"
          name="end_date"
          label="Tanggal Selesai Masa Kerja"
          placeholder="(Opsional)"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="hr_office_id"
          label="Lokasi Kantor"
          placeholder="Pilih Lokasi Kantor Pegawai"
          request={async () =>
            (await getOffice({})).data.map((e: any) => {
              return { value: e.id, label: e.name };
            })
          }
          rules={[{ required: true, message: 'Lokasi Kantor wajib diisi' }]}
        />

        <ProFormSelect
          width="md"
          name="hr_shift_id"
          label="Shift"
          placeholder="Pilih Shift"
          request={async () =>
            (await getShift({})).data.map((e: ShiftFeature.ShiftListItem) => {
              return { value: e.id, label: `${e.name} (${e.start_time} - ${e.end_time})` };
            })
          }
          rules={[{ required: true, message: 'Shift wajib diisi' }]}
        />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="hr_education_level_id"
          label="Tingkat Pendidikan"
          placeholder="Pilih Tingkat Pendidikan"
          request={async () =>
            (await getEducationLevel({})).data.map((e: any) => {
              return { value: e.id, label: e.name };
            })
          }
          rules={[{ required: true, message: 'Tingkat pendidikan wajib diisi' }]}
        />
        <ProFormText
          width="md"
          name="education_note"
          label="Keterangan Tingkat Pendidikan"
          placeholder="(Opsional)"
        />
      </ProForm.Group>
      <Divider />
      <ProFormText
        width="md"
        name="email"
        label="Email"
        placeholder="Masukkan Email"
        rules={[
          {
            required: true,
            message: 'Email wajib diisi',
          },
          {
            type: 'email',
            message: 'Email tidak sesuai',
          },
        ]}
      />
      <ProForm.Group>
        <ProFormText.Password
          width="md"
          name="password"
          label="Password"
          placeholder="Masukkan Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        />
        <ProFormText.Password
          width="md"
          dependencies={['password']}
          name="password_confirmation"
          label="Konfirmasi Password"
          placeholder="Masukkan Ulang Password"
          rules={[
            {
              required: true,
              message: 'Mohon masukkan ulang!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Password tidak sama!'));
              },
            }),
          ]}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};

export default EmployeeForm;
