import { formatRupiah } from '@/common/utils/utils';
import { useModel } from '@umijs/max';
import { Button, Flex, InputNumber } from 'antd';
import { useEffect, useRef } from 'react';

type Props = {
  payment: number;
  setPayment: (val: number) => void;
};

const rupiahDenom = [100000, 50000, 20000, 10000, 5000, 2000, 1000];

const CashForm = ({ payment, setPayment }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [payment]);

  const { totalAmount } = useModel('POS.usePos');
  return (
    <div>
      <InputNumber
        style={{
          width: '100%',
          fontSize: '16pt',
          textAlign: 'end',
        }}
        value={payment.toString()}
        onChange={(value) => {
          if (value) {
            setPayment(parseInt(value));
          }
        }}
        step={500}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
        placeholder={'(Rp) Pembayaran'}
      />

      <Flex gap={'small'} wrap={'wrap'} style={{ marginTop: '12px' }}>
        {rupiahDenom.map((e) => (
          <Button key={'amount_' + e} onClick={() => setPayment(e)} disabled={e < totalAmount}>
            {formatRupiah(e)}
          </Button>
        ))}
      </Flex>

      <span style={{ marginTop: '12px', display: 'block' }}>Kembalian</span>

      {payment - totalAmount > 0 ? (
        <h1 style={{ color: 'green' }}>{formatRupiah(payment - totalAmount)}</h1>
      ) : (
        <h1 style={{ color: 'red' }}>Rp 0</h1>
      )}
    </div>
  );
};

export default CashForm;
