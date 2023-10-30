// components/SearchableSelectInput.tsx
import { Select } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { debounce } from 'lodash';
import React, { useImperativeHandle, useState } from 'react';

interface OptionType {
  label: string;
  value: string;
}

interface SearchableSelectInputStandardProps {
  ref?: any;
  style?: React.CSSProperties;
  placeholder?: string;
  onChange?: any;
  value?: any;
  size?: SizeType;
  fetchOptions: (query: string) => Promise<OptionType[]>; // Define the fetchOptions prop
}

const SearchableSelectInputStandard: React.FC<SearchableSelectInputStandardProps> =
  React.forwardRef(({ style, onChange, placeholder, value, size, fetchOptions }, ref) => {
    const selectRef = React.useRef<any>(null);

    // Use useImperativeHandle to forward methods or properties to the parent component
    useImperativeHandle(ref, () => ({
      // Add any methods or properties you want to expose to the parent component
      focus: () => {
        if (selectRef.current) {
          selectRef.current.focus();
        }
      },
      // You can add more methods or properties as needed
    }));

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
        ref={selectRef}
        style={style}
        size={size}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        showSearch={true}
        filterOption={false}
        onSearch={handleSearch}
        options={options}
        allowClear
      />
    );
  });

export default SearchableSelectInputStandard;
