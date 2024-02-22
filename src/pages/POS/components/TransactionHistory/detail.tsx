import { formatDateTime, formatRupiah, isoDateFormat } from '@/common/utils/utils';
import { CloseOutlined, PrinterOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Drawer, Space } from 'antd';
import confirm from 'antd/lib/modal/confirm';
import moment from 'moment';
import { useState } from 'react';
import { POSTransaction, mapPaymentMethodName } from '../../data/data';
import { voidTransaction } from '../../data/service';

type Props = {
  transaction?: POSTransaction;
  open: boolean;
  onClose: () => void;
  onVoid?: () => void;
  readonly?: boolean;
};

const TransactionDetail = ({ transaction, open, onClose, onVoid, readonly = false }: Props) => {
  const { printTrx } = useModel('POS.usePos');

  const [loading, setLoading] = useState<boolean>(false);

  const handlePrint = () => {
    if (transaction) {
      printTrx(transaction);
    }
  };

  const handleVoid = async () => {
    if (transaction) {
      confirm({
        title: 'Anda yakin ingin void transaksi ini?',
        onOk: async () => {
          setLoading(true);
          await voidTransaction(transaction.id);
          setLoading(false);
          if (onVoid) {
            onVoid();
            onClose();
          }
        },
      });
    }
  };

  const buildExtraButton = () => {
    if (transaction && !readonly) {
      if (transaction.deleted_at === undefined || transaction.deleted_at === null) {
        const createdDate = moment(transaction.created_at, isoDateFormat);
        let isVoidable = createdDate.diff(moment(), 'hours') > 24;
        return (
          <Space>
            {isVoidable ? (
              <Button onClick={handleVoid} loading={loading} danger size="small">
                <CloseOutlined /> VOID
              </Button>
            ) : (
              <></>
            )}
            <Button onClick={handlePrint} size="small">
              <PrinterOutlined /> CETAK
            </Button>
          </Space>
        );
      }
    }

    return <></>;
  };

  return (
    <Drawer
      width={'450px'}
      open={open}
      onClose={onClose}
      title="Detail Transaksi"
      extra={buildExtraButton()}
    >
      {transaction && (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ margin: '12px 0px', width: '50%' }}>
              <span style={{ display: 'block', marginBottom: '4px' }}>No. Order</span>
              <strong>{transaction.order_no}</strong>
            </div>

            <div style={{ margin: '12px 0px', width: '50%' }}>
              <span style={{ display: 'block', marginBottom: '4px' }}>Tanggal</span>
              <strong>
                {formatDateTime(transaction.created_at, 'DD/MM/YYYY HH:mm:ss', isoDateFormat)}
              </strong>
            </div>

            <div style={{ margin: '12px 0px', width: '50%' }}>
              <span style={{ display: 'block', marginBottom: '4px' }}>Metode Pembayaran</span>
              <strong>{mapPaymentMethodName(transaction.payment_method.code)}</strong>
            </div>

            <div style={{ margin: '12px 0px', width: '50%' }}>
              <span style={{ display: 'block', marginBottom: '4px' }}>Anggota</span>
              <strong>{transaction.member?.name ?? 'NON ANGGOTA'}</strong>
            </div>
          </div>

          {/* <span style={{ display: 'block', marginBottom: '4px', marginTop: '20px' }}>Produk</span> */}
          <hr />
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Produk</th>
                <th>Qty</th>
                <th style={{ textAlign: 'right' }}>Satuan</th>
                <th style={{ textAlign: 'right' }}>Sub. Total</th>
              </tr>
            </thead>
            <tbody>
              {transaction.details.map((e) => (
                <tr key={'trx_' + e.id.toString()}>
                  <td style={{ padding: '10px 0px' }}>{e.product_name}</td>
                  <td style={{ textAlign: 'center', padding: '10px 0px' }}>{e.quantity}</td>
                  <td style={{ textAlign: 'right', padding: '10px 0px' }}>
                    {formatRupiah(e.unit_price)}
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px 0px' }}>
                    {formatRupiah(e.total_price)}
                  </td>
                </tr>
              ))}
              <tr style={{ borderTop: '0.5px dashed grey' }}>
                <td style={{ textAlign: 'right', padding: '10px 4px' }} colSpan={3}>
                  Total Barang{' '}
                </td>
                <td style={{ textAlign: 'right', padding: '10px 0px' }}>
                  {transaction.total_item}
                </td>
              </tr>
              <tr>
                <td style={{ textAlign: 'right', padding: '10px 4px' }} colSpan={3}>
                  Total Belanja{' '}
                </td>
                <td style={{ textAlign: 'right', padding: '10px 0px' }}>
                  {formatRupiah(transaction.total_price)}
                </td>
              </tr>
              <tr>
                <td style={{ textAlign: 'right', padding: '10px 4px' }} colSpan={3}>
                  Voucher{' '}
                </td>
                <td style={{ textAlign: 'right', padding: '10px 0px' }}>
                  {formatRupiah(transaction.discount ?? 0)}
                </td>
              </tr>

              <tr>
                <td style={{ textAlign: 'right', padding: '10px 4px' }} colSpan={3}>
                  Total{' '}
                </td>
                <td
                  style={{
                    textAlign: 'right',
                    padding: '10px 0px',
                    fontSize: '12pt',
                    fontWeight: 'bold',
                  }}
                >
                  {formatRupiah(transaction.total_amount)}
                </td>
              </tr>

              {transaction.voucher !== undefined && transaction.voucher !== null ? (
                <>
                  <tr style={{ borderTop: '0.5px dashed grey' }}>
                    <td style={{ textAlign: 'right', padding: '10px 4px' }} colSpan={3}>
                      Nama Voucher{' '}
                    </td>
                    <td style={{ textAlign: 'right', padding: '10px 0px' }}>
                      {transaction.voucher.name}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'right', padding: '10px 4px' }} colSpan={3}>
                      Kode Voucher{' '}
                    </td>
                    <td style={{ textAlign: 'right', padding: '10px 0px' }}>
                      {transaction.voucher.barcode}
                    </td>
                  </tr>
                </>
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </>
      )}
    </Drawer>
  );
};

export default TransactionDetail;
