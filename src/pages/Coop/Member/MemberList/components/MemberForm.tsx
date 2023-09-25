import { convertValueEntryToOptions } from '@/common/utils/utils';
import {
  DrawerForm,
  ProForm,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Divider, message } from 'antd';
import React, { Dispatch, SetStateAction, useRef } from 'react';
import { history } from 'umi';
import { memberStatus, memberType } from '../../data/data';
import { addMember } from '../../data/services/service';

export type MemberFormProps = {
  onSubmit: () => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const MemberForm: React.FC<MemberFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();
  const handleSubmit = async (value: { [key: string]: any }) => {
    const data = {
      ...value,
    };

    try {
      const newMember = await addMember(data);
      console.log(newMember);
      if (newMember.success) {
        props.onSubmit();
        message.success('Data Anggota Berhasil Dibuat');
        const id = newMember.data.id;
        history.push(`/coop/member/${id}`);
      }
      return true;
    } catch (e: any) {
      console.log(e);
      if (e.response?.data?.message) {
        if (e.response?.data?.errors) {
          Object.values(e.response!.data!.errors).forEach((value: any) => {
            message.error(value[0]);
          });
        } else {
          message.error(e.response?.data?.message);
        }
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
      title="Tambah Anggota"
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
          name="member_no"
          label="Nomor Anggota"
          placeholder="Masukkan Nomor Anggota"
          rules={[
            {
              required: true,
              message: 'No. Anggota wajib diisi',
            },
          ]}
        />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="type"
          label="Jenis Anggota"
          placeholder="Masukkan Jenis Anggota"
          options={convertValueEntryToOptions(memberType)}
          rules={[
            {
              required: true,
              message: 'Masukkan Jenis Anggota',
            },
          ]}
        />

        <ProFormSelect
          width="md"
          name="status"
          label="Status Anggota"
          placeholder="Masukkan Status Anggota"
          options={convertValueEntryToOptions(memberStatus)}
          rules={[
            {
              required: true,
              message: 'Masukkan Status Anggota',
            },
          ]}
        />
      </ProForm.Group>

      <Divider></Divider>

      <ProFormText
        width="lg"
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

export default MemberForm;
