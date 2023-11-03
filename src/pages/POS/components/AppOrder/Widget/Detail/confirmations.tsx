import { formatRupiah } from '@/common/utils/utils';
import { AppOrderConfirmation } from '@/pages/POS/data/data';
import { Image, Modal, Typography } from 'antd';

import React, { useState } from 'react';

const { Text, Link } = Typography;

type Props = {
  open: boolean;
  onClose: () => void;
  confirmations: AppOrderConfirmation[];
};

const PaymentConfirmationModal: React.FC<Props> = ({ open, onClose, confirmations }) => {
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState('');
  return (
    <Modal title={'Konfirmasi Bukti Pembayaran'} open={open} onCancel={onClose}>
      <table style={{ width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '0.8px solid #c7c7c7' }}>
            <th style={{ textAlign: 'left' }}>Tanggal</th>
            <th style={{ textAlign: 'left' }}>Nominal</th>
            <th style={{ textAlign: 'left' }}>Catatan</th>
            <th style={{ textAlign: 'left' }}>Bukti</th>
          </tr>
        </thead>
        <tbody>
          {confirmations.map((e) => {
            return (
              <tr key={e.id} style={{ borderBottom: '0.8px solid #c7c7c7' }}>
                <td>{e.date}</td>
                <td>{formatRupiah(e.total_paid)}</td>
                <td>
                  <Text ellipsis={true}>{e.note}</Text>
                </td>
                <td>
                  {e.image_url && (
                    <Link
                      onClick={() => {
                        setImage(e.image_url!);
                        setVisible(true);
                      }}
                    >
                      Lihat Bukti
                    </Link>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Image
        width={200}
        style={{ display: 'none' }}
        preview={{
          visible,
          src: image,
          onVisibleChange: (value) => {
            setVisible(value);
          },
        }}
      />
    </Modal>
  );
};

export default PaymentConfirmationModal;
