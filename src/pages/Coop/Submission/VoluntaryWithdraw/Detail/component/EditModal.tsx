import { formatRupiah } from '@/common/utils/utils';
import { ModalForm, ProFormInstance, ProFormMoney } from '@ant-design/pro-components';
import confirm from 'antd/es/modal/confirm';
import React, { useEffect, useRef } from 'react';
import { VoluntaryWithdrawSubmissionDetail } from '../../data/data';
import { editVoluntaryWithdraw } from '../../data/service';

interface VoluntaryWithdrawEditProp {
  submission: VoluntaryWithdrawSubmissionDetail;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onSuccess: () => void;
}

const VoluntaryWithdrawEditModal: React.FC<VoluntaryWithdrawEditProp> = (prop) => {
  const formRef = useRef<ProFormInstance>();

  async function submit(value: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      confirm({
        title: 'Anda yakin?',
        content: 'Anda yakin ingin mengubah pengajuan?',
        okCancel: true,
        onOk: async () => {
          editVoluntaryWithdraw(prop.submission.id, value)
            .then(() => {
              prop.setIsOpen(false);
              prop.onSuccess();
              resolve(true);
            })
            .catch(() => {
              reject(false);
            });
        },
        onCancel: () => {
          reject();
        },
      });
    });
  }

  useEffect(() => {
    console.log(prop.submission.amount);
    formRef.current?.setFieldsValue({ amount: prop.submission.amount });
  }, [prop]);
  return (
    <>
      <ModalForm
        formRef={formRef}
        title={'Ubah Nominal Pengajuan Penarikan Simpanan'}
        open={prop.isOpen}
        onOpenChange={prop.setIsOpen}
        onFinish={submit}
        width={500}
      >
        <ProFormMoney
          rules={[
            {
              required: true,
              message: 'Nominal Is Required',
            },
            {
              validator: async (_, value) => {
                const maxValue = prop.submission.savings.voluntary_saving;
                if (parseFloat(value) > maxValue) {
                  return Promise.reject(
                    `Melebihi nilai simpanan sukarela : ${formatRupiah(maxValue)}`,
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
          customSymbol="Rp"
          placeholder="Masukkan Nominal"
          name="amount"
          label="Nominal Simpanan"
          labelCol={{ span: 24 }}
        />
      </ModalForm>
    </>
  );
};

export default VoluntaryWithdrawEditModal;
