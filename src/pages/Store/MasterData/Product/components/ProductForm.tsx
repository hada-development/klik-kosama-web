import { ImageUploadPreview } from '@/common/components';
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
import { useAccess, useModel } from '@umijs/max';
import { Menu, MenuProps, Spin, message } from 'antd';
import confirm from 'antd/es/modal/confirm';
import { Button } from 'antd/lib';
import { MenuInfo } from 'rc-menu/lib/interface';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { getProductCategory } from '../../ProductCategory/data/services/service';
import { Barcode } from '../data/data';
import {
  deleteProduct,
  getProductDetail,
  getProductUOM,
  storeProduct,
  updateProduct,
} from '../data/services';
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
  {
    label: 'Gambar',
    key: 'image',
    className: 'item',
  },
];

const ProductForm: React.FC<{
  visible: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  onSubmit: (isSuccess: boolean) => Promise<boolean>;
  productId?: number;
}> = ({ visible, onClose, onSubmit, productId }) => {
  const { storeID } = useModel('Store.useStore');
  const [activeTab, setActiveTab] = useState<string>('detail');
  const [barcodes, setBarcodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [imageAddress, setImageAddress] = useState<string | undefined>();

  const [uomList, setUomList] = useState<any[]>([]);

  const formRef = useRef<ProFormInstance>();

  const access = useAccess();

  const handleDelete = function () {
    confirm({
      title: 'Hapus Produk?',
      content: 'Anda yakin ingin menghapus produk ini?',
      onOk: async () => {
        if (productId) {
          const hide = message.loading('Mohon tunggu');
          deleteProduct(productId);
          hide();
          await onSubmit(true);
          message.success('Berhasil menghapus');
          onClose(false);
        }
      },
    });
  };

  useEffect(() => {
    getProductUOM().then(function (result) {
      setUomList(result);
    });
  }, []);

  useEffect(() => {
    setActiveTab('detail');
    setImageAddress(undefined);
    setBarcodes([]);

    if (productId) {
      setIsLoading(true);
      getProductDetail(storeID, productId).then((data: any) => {
        let product = data.data;
        console.log(product);
        let barcodes = product.barcodes.map((br: Barcode) => br.value);
        setBarcodes(barcodes);
        setImageAddress(product.image?.address);

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
      submitter={{
        render: (props) => {
          console.log(props);
          return [
            <Button key={'close'} onClick={() => onClose(false)}>
              Tutup
            </Button>,
            <Button type="primary" key={'submit'} onClick={props.form?.submit}>
              Simpan
            </Button>,
            access.canAdmin ? (
              <Button danger key={'delete'} onClick={handleDelete}>
                Delete
              </Button>
            ) : (
              <></>
            ),
          ];
        },
      }}
      onFinish={async (data) => {
        console.log(data);
        if (productId) {
          await updateProduct(storeID, productId, data);
        } else {
          await storeProduct(storeID, data);
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
            display: activeTab === 'detail' ? 'block' : 'none',
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
            options={uomList}
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
            display: activeTab === 'price' ? 'block' : 'none',
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
            display: activeTab === 'stock' ? 'block' : 'none',
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
            placeholder="Restock Level (Minimum Restock)"
            help="Restock Level (Minimum Restock)"
            width="lg"
            name={['stocks', 0, 'restock_level']}
            label="Restok Level"
          />
        </div>

        <div
          className="menu-pane"
          style={{
            display: activeTab === 'image' ? 'block' : 'none',
          }}
        >
          <ProForm.Item name="image" label="Gambar" style={{ width: '200px', height: '200px' }}>
            <ImageUploadPreview width={'200px'} height={'200px'} valueUrl={imageAddress} />
          </ProForm.Item>
        </div>
      </Spin>
    </DrawerForm>
  );
};

export default ProductForm;
