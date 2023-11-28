import { useModel } from '@umijs/max';
import { Select } from 'antd';

type Props = {};

const StoreSelection = (props: Props) => {
  const { storeID, setStoreID } = useModel('Store.useStore');
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
      value={storeID}
      onChange={setStoreID}
    />
  );
};

export default StoreSelection;
