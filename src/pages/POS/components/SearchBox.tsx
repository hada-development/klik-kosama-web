import DarkModeToggle from '@/common/components/DarkModeToggle';
import FullscreenToggle from '@/common/components/FullscreenToggle';
import { shortcutService } from '@/common/services/custom/shortcutService';
import { formatRupiah } from '@/common/utils/utils';
import { BarcodeOutlined, SearchOutlined, TagOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { AutoComplete, Flex, Input, InputRef, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib';
import { debounce } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { POSProduct } from '../data/data';
import { getProduct } from '../data/service';
import StoreSelection from './StoreSelection';

type Props = {};

const options = [
  { label: <BarcodeOutlined />, value: 'barcode' },
  { label: <TagOutlined />, value: 'name' },
];

export default function SearchBox({}: Props) {
  const { addItem, storeId } = useModel('POS.usePos');
  const [searchType, setSearchType] = useState<'name' | 'barcode'>('barcode');
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<POSProduct[]>([]);

  const inputRef = useRef<InputRef>(null);

  const onRadioChange = ({ target: { value } }: RadioChangeEvent) => {
    setSearchType(value);
  };

  // Function to focus on the input field
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  useEffect(() => {
    focusInput();
    shortcutService.registerShortcut('F1', false, () => {
      setSearchType('barcode');
      focusInput();
    });

    shortcutService.registerShortcut('F2', false, () => {
      setSearchType('name');
      focusInput();
    });
    // Register more shortcuts as needed

    return () => {
      // Clean up shortcuts when the component unmounts
      shortcutService.unregisterShortcut('F1', false); // Optionally unregister shortcuts
      shortcutService.unregisterShortcut('F2', false); // Optionally unregister shortcuts
    };
  }, []);

  const handleSearch = async (value: string) => {
    setSearchText(value);
    if (searchType == 'barcode') {
      return;
    }
    const debouncedSearch = debounce(async () => {
      const response = await fetchProductsFromDatabase(value);
      autoSelectOnBarcode(response);
      setResults(response);
    }, 300);

    debouncedSearch();
  };

  const fetchProductsFromDatabase = async (query: string) => {
    const data = (await getProduct(storeId, query, searchType)).data;
    return data;
  };

  const onKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isEnter = e.key == 'Enter';
    if (isEnter) {
      const response = await fetchProductsFromDatabase(searchText);
      autoSelectOnBarcode(response);
    }
  };

  const autoSelectOnBarcode = (result: POSProduct[]) => {
    if (searchType == 'barcode') {
      if (result.length > 0) {
        const firstResult = result[0];
        onSelect(firstResult.name, { product: firstResult });
      }
    }
  };

  const onSelect = (value: string, option: { product: POSProduct }) => {
    setResults([]);
    addItem(option.product);
    setSearchText('');
  };

  const searchCaption = searchType == 'barcode' ? 'barcode [F1]' : 'nama [F2]';

  return (
    <Flex style={{ width: '100%' }} justify="space-between">
      <Input.Group>
        <Radio.Group
          options={options}
          onChange={onRadioChange}
          value={searchType}
          optionType="button"
          buttonStyle="solid"
        />
        <AutoComplete
          options={results.map((product: any) => ({
            value: `${product.sku} - ${product.name} - ${formatRupiah(
              product.sell_price,
            )} (STOCK: ${product.stock})`,
            product,
          }))}
          value={searchText}
          style={{ width: '80%' }}
          onSelect={onSelect}
          onSearch={handleSearch}
          onKeyDown={onKeyDown}
        >
          <Input
            ref={inputRef}
            bordered={false}
            placeholder={`Cari berdasarkan ${searchCaption}`}
            prefix={<SearchOutlined />}
            allowClear
          />
        </AutoComplete>
      </Input.Group>

      <Flex align="center" gap={'8px'}>
        <StoreSelection />
        <DarkModeToggle />
        <FullscreenToggle />
      </Flex>
    </Flex>
  );
}
