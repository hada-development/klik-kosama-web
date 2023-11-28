import PrintHeader from '@/common/components/PrintHeader';
import SearchableSelectInput from '@/common/components/SearchableSelectInput';
import { formatRupiah } from '@/common/utils/utils';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PrinterOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  PageContainer,
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormInstance,
  ProFormMoney,
  ProFormText,
  ProFormUploadDragger,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Card, Modal, Spin, Table, message } from 'antd';
import { isArray, isNumber } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { history, useParams } from 'umi';
import { getProductDataTable } from '../../MasterData/Product/data/services';
import { getSupplier } from '../../MasterData/Supplier/data/services/service';
import { PurchaseDetail, PurchaseItem } from '../data/data';
import { getPurchase, publishPurchase, storePurchase, updatePurchase } from '../data/services';

const PurchaseFormPage: React.FC = () => {
  const { storeID } = useModel('Store.useStore');
  const { confirm } = Modal;
  const formRef = useRef<ProFormInstance>();
  const [dataSource, setDataSource] = useState<PurchaseItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isReadonly, setIsReadonly] = useState<boolean>(true);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const { purchaseId } = useParams<{ purchaseId?: string }>();

  const printableRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printableRef.current!,
  });

  useEffect(() => {
    loadPage(purchaseId);
  }, [purchaseId]);

  function loadPage(purchaseId?: string) {
    if (purchaseId) {
      setIsLoading(true);
      setIsReadonly(true);
      setIsEditable(false);
      loadPurchase(parseInt(purchaseId));
    } else {
      setIsLoading(false);
      setIsReadonly(false);
    }
  }

  async function loadPurchase(id: number) {
    try {
      const response = await getPurchase(id);
      try {
        setIsLoading(false);
        const data: PurchaseDetail = response;
        console.log(data);
        setDataSource(data.items);
        if (data.status == 'draft') {
          setIsEditable(true);
        }
        formRef.current?.setFieldsValue({
          ...data,
          supplier_id: {
            value: data.supplier_id,
            label: data.supplier_name,
          },
        });
      } catch (e) {
        history.push('/404');
      }
    } catch (error) {
      console.error('Error fetching purchase:', error);
    }
  }

  const columns = [
    {
      title: 'Produk',
      key: 'product_id',
      dataIndex: 'product_id',
      render: (text: any, record: PurchaseItem) => {
        var initialValue = undefined;
        if (record.product) {
          initialValue = {
            value: record.product_id,
            label: `${record.product!.sku} - ${record.product!.name}`,
          };
        }
        console.log(initialValue);
        return (
          <SearchableSelectInput
            key={'items' + record.id + 'product_id'}
            placeholder="Cari Produk (Ketik Minimal 3 Huruf)"
            name={['items', record.id, 'product_id']}
            label=""
            readonly={isReadonly}
            initialValue={initialValue}
            width={'xl'}
            rules={[{ required: true, message: 'Mohon Masukkan Produk' }]}
            fetchOptions={async (query) =>
              (await getProductDataTable(storeID, { name: query })).data!.map((e: any) => {
                return { value: e.id, label: `${e.sku} - ${e.name}` };
              })
            }
          />
        );
      },
    },
    {
      title: 'Quantity',
      key: 'quantity',
      dataIndex: 'quantity',
      valueType: 'digit',
      width: '100px',
      render: (text: any, record: PurchaseItem) => (
        <ProFormDigit
          name={['items', record.id, 'quantity']}
          initialValue={text}
          placeholder={'Masukkan Jumlah'}
          readonly={isReadonly}
          rules={[{ required: true, message: 'Mohon Masukkan Jumlah' }]}
          min={0}
        />
      ),
    },
    {
      title: 'Harga Pokok',
      key: 'unit_price',
      dataIndex: 'unit_price',
      width: '200px',
      render: (text: any, record: PurchaseItem) =>
        isReadonly ? (
          formatRupiah(text)
        ) : (
          <ProFormMoney
            name={['items', record.id, 'unit_price']}
            initialValue={text}
            locale="id-ID"
            readonly={isReadonly}
            placeholder={'Masukkan Nominal'}
            rules={[{ required: true, message: 'Mohon Masukkan Harga Pokok' }]}
            min={0}
          />
        ),
    },
    {
      title: 'Sub Total',
      key: 'sub_total',
      dataIndex: 'sub_total',
      width: '200px',
      align: 'right' as 'right',
      render: (text: any, record: PurchaseItem) => (isNumber(text) ? formatRupiah(text) : text),
    },
    {
      title: '',
      key: 'action',
      width: 5,
      render: (text: any, record: any) =>
        !isReadonly && (
          <Button danger onClick={() => handleRemoveItem(record.id)}>
            <DeleteOutlined />
          </Button>
        ),
    },
  ];

  const handleRemoveItem = (id: number) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: 'Anda yakin ingin hapus item ini?',
      onOk() {
        const updatedItems = dataSource.filter((item) => item.id !== id);
        setDataSource(updatedItems);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleAddDetail = () => {
    const newItems: PurchaseItem = {
      id: dataSource.length,
      quantity: 0,
      unit_price: 0,
    };
    setDataSource([...dataSource, newItems]);
  };

  const updateItem = (index: number, column: string, value: any) => {
    try {
      const items = [...dataSource];
      const item = items[index] as any;
      item[column] = value;
      var subTotal = item.quantity * item.unit_price;
      item.sub_total = subTotal;
      setDataSource(items);
    } catch (e) {
      console.log(e);
    }
  };

  const handlePublish = () => {
    confirm({
      icon: <CheckCircleOutlined />,
      content: 'Anda yakin ingin publish pembelian ini?',
      async onOk() {
        await publishPurchase(parseInt(purchaseId!));
        message.success('Berhasil menyimpan data');
        history.push('/store/purchase');
      },
      onCancel() {},
    });
  };

  const submitForm = () => {
    formRef.current?.submit();
  };

  return (
    <PageContainer
      title={'Pembelian'}
      extra={
        <Button onClick={handlePrint}>
          <PrinterOutlined /> Cetak Halaman
        </Button>
      }
    >
      <div className="printable-area" ref={printableRef}>
        <PrintHeader title="PEMBELIAN TOKO" />
        <Spin spinning={isLoading}>
          <Card
            title={'Data Pembelian'}
            extra={[
              !isReadonly && (
                <Button key={'save'} type="primary" onClick={submitForm}>
                  <SaveOutlined /> Simpan
                </Button>
              ),
              isEditable && isReadonly && (
                <Button
                  key={'edit'}
                  style={{ marginRight: '12px' }}
                  onClick={() => setIsReadonly(false)}
                >
                  <EditOutlined /> Edit
                </Button>
              ),
              isEditable && isReadonly && (
                <Button key={'publish'} type="primary" onClick={handlePublish}>
                  <CheckCircleOutlined /> Publish
                </Button>
              ),
            ]}
          >
            <ProForm
              readonly={isReadonly}
              formRef={formRef}
              submitter={false}
              onFieldsChange={(fields, _) => {
                const field = fields[fields.length - 1];
                const fieldName = field.name;
                if (isArray(fieldName)) {
                  if (fieldName[0] == 'items') {
                    updateItem(fieldName[1], fieldName[2], field.value);
                  }
                }
              }}
              onFinish={async (data) => {
                console.log(data);
                var response = purchaseId
                  ? await updatePurchase(purchaseId!, data)
                  : await storePurchase(storeID, data);
                const id = response.data.id;
                message.success('Berhasil menyimpan data');
                if (purchaseId) {
                  loadPage(purchaseId);
                } else {
                  history.push('/store/purchase/edit/' + id);
                }
              }}
            >
              <ProForm.Group>
                <ProFormText
                  width={'lg'}
                  name={'invoice_no'}
                  label={'No Faktur'}
                  readonly={isReadonly}
                  placeholder={'Masukkan No Faktur'}
                  rules={[{ required: true, message: 'Please input invoice no!' }]}
                />

                <SearchableSelectInput
                  width={'lg'}
                  placeholder="Cari Supplier (Ketik Minimal 3 Huruf)"
                  name={'supplier_id'}
                  readonly={isReadonly}
                  label="Pilih Supplier"
                  rules={[{ required: true, message: 'Please input supplier!' }]}
                  fetchOptions={async (query) =>
                    (await getSupplier({ name: query })).data!.map((e: any) => {
                      return { value: e.id, label: `${e.name}` };
                    })
                  }
                />

                <ProFormDatePicker
                  width={'lg'}
                  name={'date'}
                  label={'Tanggal'}
                  readonly={isReadonly}
                  rules={[{ required: true, message: 'Please input date!' }]}
                />

                <ProFormText
                  width={'lg'}
                  name={'note'}
                  readonly={isReadonly}
                  placeholder={'Masukkan catatan'}
                  label={'Catatan'}
                />
              </ProForm.Group>
              <ProFormUploadDragger
                name="file"
                label="Upload Bukti Faktur"
                max={1}
                rules={[{ required: true, message: 'Mohon isi' }]}
                title="Pilih bukti faktur"
                description="Pilih satu file"
              />
              <Table<PurchaseItem>
                rowKey="id"
                bordered
                columns={columns}
                pagination={false}
                dataSource={dataSource}
              />
              {!isReadonly && (
                <Button
                  type="dashed"
                  style={{ width: '100%', margin: '10px 0 20px 0' }}
                  onClick={handleAddDetail}
                >
                  Tambah Produk
                </Button>
              )}
            </ProForm>
          </Card>
        </Spin>
      </div>
    </PageContainer>
  );
};

export default PurchaseFormPage;
