import { useState } from 'react';
export default () => {
  const [storeID, setStoreID] = useState<number>(1);
  return {
    storeID,
    setStoreID,
  };
};
