import { publishStatuses } from '@/common/data/data';
import { ProFormSelect } from '@ant-design/pro-components';
import { Rule } from 'antd/es/form';
import React from 'react';

type PublishStatusPickerProp = {
  name: string;
  label: string;
  width?: number | 'sm' | 'md' | 'xl' | 'xs' | 'lg' | undefined;
  onChange?: ((value: any, option: any) => void) | undefined;
  rules?: Rule[] | undefined;
};

const PublishStatusPicker: React.FC<PublishStatusPickerProp> = ({
  name,
  label,
  width,
  onChange,
  rules,
}) => {
  return (
    <ProFormSelect
      name={name}
      label={label}
      width={width}
      valueEnum={publishStatuses}
      onChange={onChange}
      placeholder="Pilih Status"
      rules={rules}
    />
  );
};

export default PublishStatusPicker;
