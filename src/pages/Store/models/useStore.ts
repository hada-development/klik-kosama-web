import { useState } from 'react';
export default () => {
  const [storeID, setStoreID] = useState<number>(1);
  const [availableStores, setAvailableStores] = useState<[]>([]);
  return {
    storeID,
    setStoreID,

    availableStores,
    setAvailableStores,
  };
};
