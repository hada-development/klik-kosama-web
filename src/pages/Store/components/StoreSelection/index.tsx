import { useModel } from '@umijs/max';
import { Select } from 'antd';
import { useEffect } from 'react';

type Props = {};

const StoreSelection = (props: Props) => {
  const { storeID, setStoreID, availableStores, setAvailableStores } = useModel('Store.useStore');
  const { initialState } = useModel('@@initialState');

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
          setStoreID(firstStoreId);
        }
      } catch (error) {
        console.error(error);
      }
    };
    updateStoreIDFromUser();
  }, [initialState?.currentUser]);

  return <Select options={availableStores} value={storeID} onChange={setStoreID} />;
};

export default StoreSelection;
