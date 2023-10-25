import { ModalForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';

import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { addProductCategory, editProductCategory } from '../data/services/service';

export type ProductCategoryFormProps = {
  onCancel: (flag?: boolean, formVals?: ProductCategoryFeature.ProductCategoryListItem) => void;
  onSubmit: (values: ProductCategoryFeature.ProductCategoryListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<ProductCategoryFeature.ProductCategoryListItem>;
};

const ProductCategoryForm: React.FC<ProductCategoryFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);
    } else {
      formRef.current?.resetFields();
    }
  }, [props.open, props.values, formRef]);

  const handleSubmit = async (values: ProductCategoryFeature.ProductCategoryListItem) => {
    try {
      if (props.values) {
        await editProductCategory(props.values.id, values);
      } else {
        await addProductCategory(values);
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
      title={props.values != undefined ? 'Edit Kategori produk' : 'Tambah Kategori produk'}
      width="400px"
      formRef={formRef}
      open={props.open}
      onOpenChange={props.setOpen}
      onFinish={async (value) => {
        await handleSubmit(value);
        props.setOpen!(false);
      }}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: 'ProductCategory Name Is Required',
          },
        ]}
        placeholder="Masukkan Nama Kategori produk"
        width="md"
        name="name"
        label="Nama Kategori produk"
      />
    </ModalForm>
  );
};

export default ProductCategoryForm;
