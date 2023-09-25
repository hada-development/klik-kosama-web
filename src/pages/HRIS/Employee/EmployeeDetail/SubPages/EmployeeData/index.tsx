import { getEducationLevel } from '@/pages/HRIS/MasterData/EducationLevel/data/services/service';
import { getEmployeeType } from '@/pages/HRIS/MasterData/EmployeeType/data/services/service';
import { getOffice } from '@/pages/HRIS/MasterData/Office/data/services/service';
import { getPosition } from '@/pages/HRIS/MasterData/Position/data/services/service';
import { getShift } from '@/pages/HRIS/MasterData/Shift/data/services/service';
import {
  ProForm,
  ProFormDatePicker,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProSkeleton,
} from '@ant-design/pro-components';
import { useModel, useParams } from '@umijs/max';
import { message } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useRef } from 'react';

const EmployeeDataSubPage: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { fetch, saveData, account, loading } = useModel(
    'HRIS.Employee.EmployeeDetail.SubPages.Account.useUserEmployeeAccount',
  );
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if ((!account || account?.data.id != employeeId) && employeeId) {
      fetch(parseInt(employeeId!));
    }
  }, [employeeId]);

  const handleSave = (employeeId: number | string, value: any) => {
    const hide = message.loading('Sedang menyimpan');
    saveData(employeeId!, {
      employee: value,
    })
      .then(() => {
        message.success('Berhasil menyimpan data');
      })
      .catch((e) => {
        console.log(e);
        console.log(e.response?.response?.data);
      })
      .finally(() => {
        hide();
      });
  };

  useEffect(() => {
    if (account) {
      if (account) {
        formRef.current?.setFieldsValue({
          ...account.data,
          hr_shift_id: account.data.shift?.id ?? null,
        });
      }
    }
  }, [account]);

  if (loading) return <ProSkeleton />;
  return (
    <>
      <ProForm
        submitter={{
          searchConfig: {
            submitText: 'Simpan Perubahan', // Change the submit button text
          },
          resetButtonProps: { style: { display: 'none' } }, //
        }}
        formRef={formRef}
        onFinish={async (value) => {
          handleSave(employeeId!, value);
          return true;
        }}
        disabled={loading}
      >
        <Title level={5}>Informasi Kepegawaian</Title>

        <ProForm.Group>
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
            placeholder="Masukkan Jurusan / Keterangan Lain (Opsional)"
          />
        </ProForm.Group>
      </ProForm>
    </>
  );
};

export default EmployeeDataSubPage;
