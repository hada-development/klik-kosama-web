import { formatDateTime, formatRupiah, isoDateFormat } from '@/common/utils/utils';
import {
  AppOrder,
  mapAppOrderAction,
  mapAppOrderButton,
  mapAppOrderStatusTag,
  mapPaymentMethodName,
} from '@/pages/POS/data/data';
import { getAppOrderDetail, updateAppOrder } from '@/pages/POS/data/service';
import { Button, Modal, Spin } from 'antd';
import Link from 'antd/lib/typography/Link';
import React, { useEffect, useState } from 'react';
import PaymentConfirmationModal from './confirmations';

type Props = {
  id?: number;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
};

const AppOrderDetailModal: React.FC<Props> = ({ id, open, onClose, onUpdated }) => {
  const [order, setOrder] = useState<AppOrder | undefined>();
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAction = () => {
    if (order) {
      const actionStatus = mapAppOrderAction[order.status];
      const data = {
        status: actionStatus,
      };
      setLoading(true);
      updateAppOrder(order.id, data)
        .then((res) => {
          onClose();
          onUpdated?.();
        })
        .finally(() => setLoading(false));
    }
  };

  const handleCancel = () => {
    if (order) {
      const data = {
        status: 'canceled',
      };
      setLoading(true);
      updateAppOrder(order.id, data)
        .then((res) => {
          onClose();
          onUpdated?.();
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      getAppOrderDetail(id)
        .then((response) => {
          if (response.success) {
            setOrder(response.data);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <Modal
      width={800}
      open={open}
      onCancel={onClose}
      title="Pesanan via Aplikasi"
      footer={
        <>
          {order &&
            ['waiting-for-payment', 'waiting-for-confirmation', 'ready-to-pickup'].includes(
              order.status,
            ) && (
              <Button onClick={handleCancel} danger type="primary">
                Batalkan
              </Button>
            )}
          {order && ['waiting-for-confirmation', 'ready-to-pickup'].includes(order.status) && (
            <Button onClick={handleAction} type="primary">
              {mapAppOrderButton[order!.status]}
            </Button>
          )}
        </>
      }
    >
      <Spin spinning={loading}>
        {order && (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <div style={{ margin: '12px 0px', width: '33%' }}>
                <span style={{ display: 'block', marginBottom: '4px' }}>No. Order</span>
                <strong>{order.order_no}</strong>
              </div>

              <div style={{ margin: '12px 0px', width: '33%' }}>
                <span style={{ display: 'block', marginBottom: '4px' }}>Tanggal</span>
                <strong>
                  {formatDateTime(order.created_at, 'DD/MM/YYYY HH:mm:ss', isoDateFormat)}
                </strong>
              </div>

              <div style={{ margin: '12px 0px', width: '33%' }}>
                <span style={{ display: 'block', marginBottom: '4px' }}>Metode Pembayaran</span>
                <strong>{mapPaymentMethodName(order.payment_method.code)}</strong>
              </div>

              <div style={{ margin: '12px 0px', width: '33%' }}>
                <span style={{ display: 'block', marginBottom: '4px' }}>Anggota</span>
                <strong>
                  {order.user.member?.name ?? 'NON ANGGOTA'} - {order.user.member?.member_no}
                </strong>
              </div>

              <div style={{ margin: '12px 0px', width: '33%' }}>
                <span style={{ display: 'block', marginBottom: '4px' }}>Status</span>
                <strong>{mapAppOrderStatusTag[order.status]}</strong>
              </div>

              {order.confirmations?.length > 0 && (
                <div style={{ margin: '12px 0px', width: '33%' }}>
                  <span style={{ display: 'block', marginBottom: '4px' }}>
                    Konfirmasi Pembayaran
                  </span>
                  <Link onClick={() => setOpenConfirmation(true)}>Lihat Bukti</Link>
                </div>
              )}
            </div>

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
                {order.items.map((e) => (
                  <tr>
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
                  <td style={{ textAlign: 'right', padding: '10px 0px' }}>{order.total_item}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'right', padding: '2px 4px' }} colSpan={3}>
                    Total Belanja{' '}
                  </td>
                  <td style={{ textAlign: 'right', padding: '2px 0px' }}>
                    {formatRupiah(order.total_amount + order.discount)}
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'right', padding: '2px 4px' }} colSpan={3}>
                    Diskon{' '}
                  </td>
                  <td style={{ textAlign: 'right', padding: '2px 0px' }}>
                    {formatRupiah(order.discount ?? 0)}
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'right', padding: '2px 4px' }} colSpan={3}>
                    Total{' '}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      padding: '2px 0px',
                      fontSize: '12pt',
                      fontWeight: 'bold',
                    }}
                  >
                    {formatRupiah(order.total_amount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </Spin>
      {order && (
        <PaymentConfirmationModal
          open={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
          confirmations={order.confirmations}
        />
      )}
    </Modal>
  );
};

export default AppOrderDetailModal;
