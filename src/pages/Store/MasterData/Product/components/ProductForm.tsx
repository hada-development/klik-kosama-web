import TagInput from '@/common/components/TagInput';
import {
  DrawerForm,
  ProForm,
  ProFormDigit,
  ProFormInstance,
  ProFormMoney,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { Menu, MenuProps, Spin } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { getProductCategory } from '../../ProductCategory/data/services/service';
import { Barcode } from '../data/data';
import { getProductDetail, storeProduct, updateProduct } from '../data/services';
import './ProductForm.less';

const items: MenuProps['items'] = [
  {
    label: 'Detail',
    key: 'detail',
    className: 'item',
  },
  {
    label: 'Harga',
    key: 'price',
    className: 'item',
  },
  {
    label: 'Stok',
    key: 'stock',
    className: 'item',
  },
];

const ProductForm: React.FC<{
  visible: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  onSubmit: (isSuccess: boolean) => Promise<boolean>;
  productId?: number;
}> = ({ visible, onClose, onSubmit, productId }) => {
  const [activeTab, setActiveTab] = useState<string>('detail');
  const [barcodes, setBarcodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if (productId) {
      setIsLoading(true);
      getProductDetail(productId).then((data: any) => {
        var product = data.data;
        console.log(product);
        var barcodes = product.barcodes.map((br: Barcode) => br.value);
        setBarcodes(barcodes);
        formRef.current?.setFieldsValue({
          ...product,
          barcodes: barcodes,
        });
        setIsLoading(false);
      });
      // formRef.current?.setFieldsValue(props.values);
    } else {
      formRef.current?.resetFields();
      setIsLoading(false);
    }
  }, [visible, productId, formRef]);

  const handleTabChange = (info: MenuInfo) => {
    setActiveTab(info.key);
  };

  return (
    <DrawerForm
      formRef={formRef}
      title={(productId ? 'Edit' : 'Tambah') + 'Data Produk'}
      width={500}
      onOpenChange={onClose}
      open={visible}
      style={{
        padding: '0px',
      }}
      onFinish={async (data) => {
        console.log(data);
        if (productId) {
          await updateProduct(productId, data);
        } else {
          await storeProduct(data);
        }
        await onSubmit(true);
        return true;
      }}
    >
      <Spin spinning={isLoading}>
        <Menu
          onClick={handleTabChange}
          selectedKeys={[activeTab]}
          mode="horizontal"
          className="product-menu"
          items={items}
        />

        <div
          className="menu-pane"
          style={{
            display: activeTab == 'detail' ? 'block' : 'none',
          }}
        >
          <ProFormSelect<number>
            rules={[
              {
                required: true,
              },
            ]}
            placeholder="Pilih Kategori Produk"
            width="lg"
            name="category_id"
            request={async (_, s) =>
              (await getProductCategory({})).data.map((e: any) => {
                return { value: e.id, label: e.name };
              })
            }
            label="Kategori Produk"
          />

          <ProFormText
            rules={[
              {
                required: true,
              },
            ]}
            placeholder="Masukkan Nama Produk"
            width="lg"
            name="name"
            label="Nama Produk"
          />

          <ProFormText
            rules={[
              {
                required: true,
              },
              {
                max: 20,
              },
            ]}
            placeholder="Masukkan Nama Tercetak "
            width="lg"
            name="printed_name"
            label="Nama Produk Tercetak (Max 20 Kar.)"
          />

          <ProFormText
            rules={[
              {
                required: true,
              },
            ]}
            placeholder="Masukkan SKU / Kode Produk"
            width="lg"
            name="sku"
            label="SKU / Kode Produk"
          />

          <ProFormSelect<string>
            rules={[
              {
                required: true,
              },
            ]}
            placeholder="Pilih UOM"
            width="lg"
            name="uom"
            options={[
              {
                label: 'PCS',
                value: 'pcs',
              },
            ]}
            label="Unit Of Measurement"
          />

          <ProForm.Item
            rules={[
              {
                required: true,
              },
            ]}
            name="barcodes"
            label="Barcode"
          >
            <TagInput value={barcodes} onChange={setBarcodes} placeholder="Masukkan Barcode " />
          </ProForm.Item>

          <ProFormSwitch
            name={['availability', 'in_pos']}
            initialValue={true}
            label="Tersedia di POS"
          />

          <ProFormSwitch
            name={['availability', 'in_app']}
            initialValue={true}
            label="Tersedia di aplikasi"
          />
        </div>

        <div
          className="menu-pane"
          style={{
            display: activeTab == 'price' ? 'block' : 'none',
          }}
        >
          <ProFormMoney
            label="Harga Pokok"
            name={['prices', 0, 'buy_price']}
            locale="id-ID"
            placeholder={'Harga Pokok'}
            min={0}
            initialValue={0}
            rules={[{ required: true, message: 'wajib diisi' }]}
          />

          <ProFormMoney
            label="Harga Jual"
            name={['prices', 0, 'sell_price']}
            locale="id-ID"
            placeholder={'Harga Jual'}
            min={0}
            initialValue={0}
            rules={[{ required: true, message: 'wajib diisi' }]}
          />
        </div>

        <div
          className="menu-pane"
          style={{
            display: activeTab == 'stock' ? 'block' : 'none',
          }}
        >
          <ProFormDigit
            rules={[
              {
                required: true,
              },
            ]}
            min={0}
            initialValue={0}
            placeholder="Stok Awal"
            width="lg"
            name={['stocks', 0, 'quantity']}
            label="Stok Awal"
          />

          <ProFormDigit
            rules={[
              {
                required: true,
              },
            ]}
            min={0}
            initialValue={0}
            placeholder="Restock Level (Minimum Restock)"
            width="lg"
            name={['stocks', 0, 'restock_level']}
            label="Restok Level"
          />
        </div>
      </Spin>
    </DrawerForm>
  );
};

export default ProductForm;
