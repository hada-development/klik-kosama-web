// components/SearchableSelectInput.tsx
import { ProFormSelect } from '@ant-design/pro-form';
import { debounce } from 'lodash';
import React, { useState } from 'react';

interface OptionType {
  label: string;
  value: string;
}

interface SearchableSelectInputProps {
  name: any;
  label: string;
  placeholder?: string;
  style?: React.CSSProperties;
  rules?: any[];
  width?: number | 'sm' | 'md' | 'xl' | 'xs' | 'lg';
  initialValue?: any;
  readonly?: boolean;
  onChange?: (value: unknown, option: OptionType | OptionType[]) => void;
  fetchOptions: (query: string) => Promise<OptionType[]>; // Define the fetchOptions prop
}

const SearchableSelectInput: React.FC<SearchableSelectInputProps> = ({
  name,
  label,
  placeholder,
  style,
  rules,
  width,
  initialValue,
  readonly,
  onChange,
  fetchOptions,
}) => {
  const [options, setOptions] = useState<OptionType[]>([]);

  const handleSearch = debounce(async (value: string) => {
    if (value) {
      const fetchedOptions = await fetchOptions(value); // Use the provided fetchOptions function
      setOptions(fetchedOptions);
    } else {
      setOptions([]);
    }
  }, 300);

  return (
    <ProFormSelect
      name={name}
      onChange={onChange}
      label={label}
      placeholder={placeholder}
      rules={rules}
      readonly={readonly}
      width={width}
      initialValue={initialValue}
      style={style}
      fieldProps={{
        showSearch: true,
        filterOption: false,
        onSearch: handleSearch,
      }}
      options={options}
    />
  );
};

export default SearchableSelectInput;
