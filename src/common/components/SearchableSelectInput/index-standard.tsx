// components/SearchableSelectInput.tsx
import { Select } from 'antd';
import { debounce } from 'lodash';
import React, { useState } from 'react';

interface OptionType {
  label: string;
  value: string;
}

interface SearchableSelectInputStandardProps {
  style?: React.CSSProperties;
  placeholder?: string;
  onChange?: any;
  fetchOptions: (query: string) => Promise<OptionType[]>; // Define the fetchOptions prop
}

const SearchableSelectInputStandard: React.FC<SearchableSelectInputStandardProps> = ({
  style,
  onChange,
  placeholder,
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
    <Select
      style={style}
      onChange={onChange}
      placeholder={placeholder}
      showSearch={true}
      filterOption={false}
      onSearch={handleSearch}
      options={options}
    />
  );
};

export default SearchableSelectInputStandard;
