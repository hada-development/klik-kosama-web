import { useModel } from '@umijs/max';
import { Select } from 'antd';

type Props = {};

const StoreSelection = (props: Props) => {
  const { storeId, setStoreId } = useModel('POS.usePos');
  return (
    <Select
      options={[
        {
          label: 'KOSAMART',
          value: 1,
        },
        {
          label: 'APOTEK',
          value: 2,
        },
      ]}
      value={storeId}
      onChange={setStoreId}
    />
  );
};

export default StoreSelection;
