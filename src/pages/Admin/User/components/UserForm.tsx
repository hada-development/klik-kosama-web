import {
  DrawerForm,
  ProForm,
  ProFormCheckbox,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';

import { submissionStatuses, webRoles } from '@/common/data/data';
import { Divider, message } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { addUser, editUser } from '../data/services/service';

export type UserFormProps = {
  onCancel: (flag?: boolean, formVals?: UserFeature.UserListItem) => void;
  onSubmit: (values: UserFeature.UserListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<UserFeature.UserListItem>;
};

const UserForm: React.FC<UserFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);
    } else {
      formRef.current?.resetFields();
    }
  }, [props.open, props.values, formRef]);

  const handleSubmit = async (values: UserFeature.UserListItem) => {
    try {
      if (props.values) {
        await editUser(props.values.id, values);
      } else {
        await addUser(values);
      }
      props.onSubmit(values);
      props.setOpen!(false);
    } catch (error: any) {
      console.error(error);
      if (error?.response) {
        if (error?.response.data.errors) {
          Object.values(error?.response.data.errors).forEach((e: any) => {
            message.error(e);
          });
        }
      }
    } finally {
      // props.onCancel();
    }
  };

  return (
    <DrawerForm
      title={props.values != undefined ? 'Edit User' : 'Tambah User'}
      width="760px"
      formRef={formRef}
      open={props.open}
      onOpenChange={props.setOpen}
      onFinish={async (value) => {
        await handleSubmit(value);
      }}
    >
      <ProForm.Group>
        <ProFormText
          rules={[
            {
              required: true,
              message: 'User Name Is Required',
            },
          ]}
          placeholder="Masukkan Nama User"
          width="md"
          name="name"
          label="Nama User"
        />

        <ProFormText
          rules={[
            {
              required: true,
              message: 'Email Is Required',
            },
          ]}
          placeholder="Masukkan Email"
          width="md"
          name="email"
          label="Email"
        />
      </ProForm.Group>

      <ProFormSelect
        name="verification_status"
        label="Status"
        width="md"
        valueEnum={submissionStatuses}
        placeholder="Pilih Status"
        rules={[{ required: true, message: 'Please select status!' }]}
      />

      <ProFormCheckbox.Group
        name="roles"
        layout="horizontal"
        label="Role"
        options={webRoles.map((e: string) => {
          return {
            label: e.toUpperCase(),
            value: e,
          };
        })}
      />

      <Divider />

      <ProForm.Group>
        <ProFormText.Password
          width="md"
          name="password"
          label="Password"
          placeholder="Masukkan Password"
          rules={[
            {
              required: props.values == undefined,
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
              required: props.values == undefined,
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

export default UserForm;
