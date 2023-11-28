import { useModel } from '@umijs/max';
import { Select } from 'antd';
import { useEffect, useState } from 'react';

type Props = {};

const StoreSelection = (props: Props) => {
  const { storeId, setStoreId } = useModel('POS.usePos');
  const { initialState } = useModel('@@initialState');
  const [availableStores, setAvailableStores] = useState<[]>([]);

  useEffect(() => {
    const updateStoreIDFromUser = async () => {
      try {
        const userData = initialState?.currentUser;
        const firstStoreId = userData?.stores?.[0]?.id;

        setAvailableStores(
          userData?.stores.map((e: any) => {
            return {
              label: e.name,
              value: e.id,
            };
          }),
        );

        if (firstStoreId !== undefined) {
          setStoreId(firstStoreId);
        }
      } catch (error) {
        console.error(error);
      }
    };
    updateStoreIDFromUser();
  }, [initialState?.currentUser]);

  return <Select options={availableStores} value={storeId} onChange={setStoreId} />;
};

export default StoreSelection;
