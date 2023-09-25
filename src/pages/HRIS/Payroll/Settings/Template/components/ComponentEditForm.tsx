import {
  DrawerForm,
  ProFormInstance,
  ProFormMoney,
  ProFormSelect,
} from '@ant-design/pro-components';
import { Radio, RadioChangeEvent } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { getPayrollComponent } from '../../PayrollComponent/data/services/service';
import { getPayrollFormula } from '../data/services/service';

export type ComponentEditFormProps = {
  onCancel: (flag?: boolean, formVals?: EmployeeComponentFeature.EmployeeComponentListItem) => void;
  onSubmit: (values: Partial<EmployeeComponentFeature.PayrollComponentItem>) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<EmployeeComponentFeature.PayrollComponentItem>;
};

const itemTypeOptions = [
  { label: 'Formula', value: 'formula' },
  { label: 'Nominal Fix', value: 'fix-amount' },
];

const ComponentEditForm: React.FC<ComponentEditFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  const [selectedComponent, setSelectedComponent] = useState<
    EmployeeComponentFeature.PayrollComponent | undefined
  >();
  const [selectedFormula, setSelectedFormula] = useState<
    EmployeeComponentFeature.PayrollFormula | undefined
  >();

  const [componentList, setComponentList] = useState<EmployeeComponentFeature.PayrollComponent[]>(
    [],
  );
  const [formulaList, setFormulaList] = useState<EmployeeComponentFeature.PayrollFormula[]>([]);

  const [itemType, setItemType] = useState<string>('formula');

  useEffect(() => {
    // Set initial values when the modal is opened
    fetchComponents();
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);

      setSelectedComponent(props.values.component);
      setSelectedFormula(props.values.formula);

      if (props.values.formula != null) {
        setItemType('formula');
      } else {
        setItemType('fix-amount');
      }
    } else {
      formRef.current?.resetFields();
      setSelectedComponent(undefined);
      setSelectedFormula(undefined);
      setFormulaList([]);
    }
  }, [props.open, props.values, formRef]);

  useEffect(() => {
    if (selectedComponent) {
      fetchFormula(selectedComponent.id);
    }
  }, [selectedComponent]);

  const fetchFormula = (componentId: number) => {
    getPayrollFormula(componentId).then((data) => setFormulaList(data));
  };

  const fetchComponents = () => {
    getPayrollComponent({}, {}).then((data) => setComponentList(data.data));
  };

  const onRadioChange = ({ target: { value } }: RadioChangeEvent) => {
    setItemType(value);
  };

  const onSubmit = (data: any) => {
    var param: Partial<PayrollTemplateFeature.PayrollTemplateItem> = { id: props.values?.id };
    if (itemType == 'formula') {
      param = {
        ...param,
        component: selectedComponent,
        formula: selectedFormula,
        ...data,
      };
    }
    if (itemType == 'fix-amount') {
      param = {
        ...param,
        component: selectedComponent,
        hr_payroll_component_id: selectedComponent?.id,
        fixed_amount: data.fixed_amount,
      };
    }
    console.log(param);
    props.onSubmit(param);
  };
  return (
    <DrawerForm
      title={'Edit Komponen Gaji'}
      size="large"
      formRef={formRef}
      open={props.open}
      onOpenChange={props.setOpen}
      onFinish={async (value) => {
        onSubmit(value);
        props.setOpen!(false);
      }}
    >
      <ProFormSelect<number>
        label="Komponen Gaji"
        name="hr_payroll_component_id"
        placeholder="Pilih Komponen Gaji"
        onChange={(value) =>
          setSelectedComponent(componentList[componentList.findIndex((e) => e.id == value)])
        }
        options={componentList.map((e: any) => ({
          value: e.id,
          label: e.name,
        }))}
        rules={[{ required: true, message: 'Jenis Pegawai wajib diisi' }]}
      />

      <Radio.Group
        style={{ width: '100%' }}
        options={itemTypeOptions}
        onChange={onRadioChange}
        value={itemType}
        optionType="button"
      />
      {itemType == 'formula' ? (
        <ProFormSelect<number>
          label="Formula Penggajian"
          name="hr_payroll_formula_id"
          placeholder="Pilih Formula Penggajian "
          onChange={(value) =>
            setSelectedFormula(formulaList[formulaList.findIndex((e) => e.id == value)])
          }
          options={formulaList.map((e: any) => ({
            value: e.id,
            label: (
              <div>
                {e.name}
                <br />
                <span style={{ marginLeft: '8px', color: 'gray' }}>{e.description}</span>
              </div>
            ),
          }))}
          rules={[{ required: true, message: 'wajib diisi' }]}
        />
      ) : (
        <></>
      )}

      {itemType == 'fix-amount' ? (
        <ProFormMoney
          label="Nominal Fix"
          name="fixed_amount"
          locale="id-ID"
          placeholder={'Masukkan Nominal'}
          min={0}
          rules={[{ required: true, message: 'wajib diisi' }]}
        />
      ) : (
        <></>
      )}
    </DrawerForm>
  );
};

export default ComponentEditForm;
