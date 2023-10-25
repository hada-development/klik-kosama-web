import { formatRupiah } from '@/common/utils/utils';
import {
  ModalForm,
  ProDescriptions,
  ProFormInstance,
  ProFormMoney,
  ProFormSelect,
} from '@ant-design/pro-components';
import { Spin } from 'antd';
import confirm from 'antd/es/modal/confirm';
import React, { useEffect, useRef, useState } from 'react';
import { Calculation, CreditSubmissionSubmissionDetail, InstallmentTerm } from '../../data/data';
import {
  editCreditSubmission,
  getAvailableInstalmentTerms,
  getCalculation,
} from '../../data/service';

interface CreditSubmissionEditProp {
  submission: CreditSubmissionSubmissionDetail;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onSuccess: () => void;
}

const debounceDelay = 500; // Adjust the debounce delay as needed (in milliseconds)

const CreditSubmissionEditModal: React.FC<CreditSubmissionEditProp> = (prop) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formRef = useRef<ProFormInstance>();
  const [terms, setTerms] = useState<InstallmentTerm[]>();
  const [term, setTerm] = useState<number>();
  const [buyPrice, setBuyPrice] = useState<number>();
  const [calculation, setCalculation] = useState<Calculation>();

  // Use useRef to store the debounce timer
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    formRef.current?.setFieldsValue({ ...prop.submission });
    if (prop.submission) {
      getInstallmentTerms(prop.submission.buy_price);
      setTerm(prop.submission.installment_term);
      setBuyPrice(prop.submission.buy_price);
    }
  }, [prop]);

  // Define a function to handle form value changes
  const handleFormValueChange = (changedValues: any, allValues: any) => {
    if ('buy_price' in changedValues) {
      const newBuyPrice = changedValues.buy_price;

      if (debounceTimer.current !== null) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        getInstallmentTerms(newBuyPrice);
        setBuyPrice(newBuyPrice);
      }, debounceDelay);
    }

    if ('installment_term' in changedValues) {
      const newInstallmentTerm = changedValues.installment_term;
      setTerm(newInstallmentTerm);
    }
  };

  async function getInstallmentTerms(amount: number) {
    setIsLoading(true);
    try {
      const response = await getAvailableInstalmentTerms(prop.submission.id, amount);
      setTerms(response.data);
    } catch (e: any) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (buyPrice && term) {
      fetchCalculation(buyPrice, term);
    }
  }, [buyPrice, term]);

  async function fetchCalculation(buyPrice: number, term: number) {
    setIsLoading(true);
    try {
      const response = await getCalculation(prop.submission.id, buyPrice, term);
      setCalculation(response.data);
    } catch (e: any) {
      console.log(e);
    }
    setIsLoading(false);
  }

  async function submit(value: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      confirm({
        title: 'Anda yakin?',
        content: 'Anda yakin ingin mengubah pengajuan?',
        okCancel: true,
        onOk: async () => {
          editCreditSubmission(prop.submission.id, value)
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

  return (
    <>
      <ModalForm
        onValuesChange={handleFormValueChange}
        formRef={formRef}
        title={'Ubah Pengajuan Kredit'}
        open={prop.isOpen}
        onOpenChange={prop.setIsOpen}
        onFinish={submit}
        width={500}
      >
        <Spin spinning={isLoading}>
          <ProFormMoney
            rules={[
              {
                required: true,
                message: 'Harga Beli Is Required',
              },
            ]}
            customSymbol="Rp"
            placeholder="Masukkan Harga Beli"
            name="buy_price"
            label="Harga Beli"
            labelCol={{ span: 24 }}
          />

          {terms && (
            <ProFormSelect
              rules={[
                {
                  required: true,
                  message: 'Harga Beli Is Required',
                },
              ]}
              name="installment_term"
              options={terms.map((e) => ({
                value: e.term,
                label: e.title,
              }))}
            />
          )}

          {calculation && (
            <ProDescriptions column={1}>
              <ProDescriptions.Item key={0} label="Angsuran / Bulan">
                {formatRupiah(calculation.monthly_installment)}
              </ProDescriptions.Item>
              <ProDescriptions.Item key={1} label="Total Angsuran">
                {formatRupiah(calculation.total_installment)}
              </ProDescriptions.Item>
              <ProDescriptions.Item key={3} label="Margin">
                {formatRupiah(calculation.total_margin)}
              </ProDescriptions.Item>
            </ProDescriptions>
          )}
        </Spin>
      </ModalForm>
    </>
  );
};

export default CreditSubmissionEditModal;
