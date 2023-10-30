import { useModel } from '@umijs/max';
import { Flex } from 'antd';
import { useEffect, useState } from 'react';
import {
  POSPaymentMethod,
  disabledIfCreditNoMember,
  mapPaymentMethodIcon,
  mapPaymentMethodName,
} from '../data/data';
import { getPaymentMethod } from '../data/service';
import POSButton from './POSButton';

type Props = {};

const PaymentMethod = (props: Props) => {
  const [paymentMethods, setPaymentMethods] = useState<POSPaymentMethod[]>([]);
  const { pmCode, changePaymentMethod, member } = useModel('POS.usePos');
  useEffect(() => {
    getPaymentMethod().then((response) => {
      if (response.data) {
        setPaymentMethods(response.data);
      }
    });
  }, []);

  return (
    <Flex gap={'small'}>
      {paymentMethods.map((_pm) => (
        <POSButton
          key={_pm.code}
          type={_pm.code == pmCode ? 'primary' : 'dashed'}
          onClick={() => changePaymentMethod(_pm)}
          title={mapPaymentMethodName(_pm.code)}
          icon={mapPaymentMethodIcon(_pm.code)}
          disabled={disabledIfCreditNoMember(_pm.code, member != undefined)}
        />
      ))}
    </Flex>
  );
};

export default PaymentMethod;
