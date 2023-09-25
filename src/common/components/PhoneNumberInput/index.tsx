// components/PhoneNumberInput.tsx
import { formatPhoneNumber } from '@/common/utils/utils';
import ProForm from '@ant-design/pro-form';
import { Input } from 'antd';
import React, { useState } from 'react';

interface PhoneNumberInputProps {
  name: string;
  label: string;
  rules?: any[]; // Define the type of rules
  placeholder?: string;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ name, label, rules, placeholder }) => {
  const [formattedValue, setFormattedValue] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedPhoneNumber = formatPhoneNumber(rawValue);
    setFormattedValue(formattedPhoneNumber);
  };

  return (
    <ProForm.Item name={name} label={label} rules={rules}>
      <Input value={formattedValue} onChange={handleInputChange} placeholder={placeholder} />
    </ProForm.Item>
  );
};

export default PhoneNumberInput;
