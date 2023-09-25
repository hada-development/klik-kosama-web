// components/SearchableSelectInput.tsx
import { ProFormSelect } from '@ant-design/pro-form';
import { debounce } from 'lodash';
import React, { useState } from 'react';

interface OptionType {
  label: string;
  value: string;
}

interface SearchableSelectInputProps {
  name: string;
  label: string;
  placeholder?: string;
  rules?: any[];
  fetchOptions: (query: string) => Promise<OptionType[]>; // Define the fetchOptions prop
}

const SearchableSelectInput: React.FC<SearchableSelectInputProps> = ({
  name,
  label,
  placeholder,
  rules,
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
      label={label}
      placeholder={placeholder}
      rules={rules}
      width={'md'}
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
