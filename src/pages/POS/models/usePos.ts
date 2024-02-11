// usePos.ts
import {
  AppOrder,
  POSItem,
  POSMember,
  POSPaymentMethod,
  POSProduct,
  POSTransaction,
  POSVoucher,
  mapPMCode,
} from '@/pages/POS/data/data';
import { message } from 'antd';
import { useState } from 'react';
import { getAppOrderDetail, storeTransaction } from '../data/service';

const defaultPm: POSPaymentMethod = {
  id: 3,
  code: 'cash',
};

export default () => {
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [storeId, setStoreId] = useState<number>(1);

  const [items, setItems] = useState<POSItem[]>([]);
  const [member, setMember] = useState<POSMember | undefined>();
  const [voucher, setVoucher] = useState<POSVoucher | undefined>();

  const [pmCode, setPmCode] = useState<keyof typeof mapPMCode>('cash');
  const [paymentMethod, setPaymentMethod] = useState<POSPaymentMethod>(defaultPm);

  const [appOrder, setAppOrder] = useState<AppOrder | undefined>();
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const [openCheckoutModal, setOpenCheckoutModal] = useState<boolean>(false);

  const [printableTrx, setprintableTrx] = useState<POSTransaction | undefined>();

  const [openTrxDrawer, setOpenTrxDrawer] = useState<boolean>(false);

  // Calculate total items and total amount
  const updateTotals = (updatedItems: POSItem[], voucher?: POSVoucher) => {
    let itemsCount = 0;
    let total = 0;
    updatedItems.forEach((item) => {
      itemsCount += item.quantity;
      total += item.subTotal;
    });

    if (voucher) {
      let subtractedTotal = total - voucher.amount;
      total = Math.max(0, subtractedTotal);
    }

    setTotalItems(itemsCount);
    setTotalAmount(total);
  };

  const addItem = (product: POSProduct) => {
    const productIndex = items.findIndex((item) => item.product_id === product.id);
    if (productIndex === -1) {
      const quantity = 1;
      // Product not found in items, so add a new item
      const newItem: POSItem = {
        product_id: product.id,
        product: product,
        quantity: quantity,
        subTotal: quantity * product.sell_price,
      };
      setItems((prevItems) => {
        const updatedItems = [newItem, ...prevItems];
        // Call updateTotals after adding an item
        updateTotals(updatedItems, voucher);
        return updatedItems;
      });
      message.success('Berhasil menambahkan produk', 1);
    } else {
      const selectedItem = items[productIndex];
      if (selectedItem.quantity + 1 > product.stock) {
        message.error('Stok barang di sistem tidak mencukupi', 3);
        return;
      }

      setItems((prevItems) => {
        const updatedItems = prevItems.map((item) => {
          if (item.product_id === product.id) {
            const dbStock = item.product.stock;
            const updatedQuantity = item.quantity + 1;
            if (updatedQuantity > dbStock) {
              return item;
            }
            const updatedSubTotal = updatedQuantity * item.product.sell_price;
            return {
              ...item,
              quantity: updatedQuantity,
              subTotal: updatedSubTotal,
            };
          }
          return item;
        });
        // Call updateTotals after updating the item
        updateTotals(updatedItems, voucher);
        return updatedItems;
      });

      message.success('Berhasil menambahkan jumlah', 1);
    }
  };

  const changeQuantity = (index: number, newQuantity: number) => {
    setItems((prevItems) => {
      let updatedItems: POSItem[];
      if (newQuantity === 0) {
        // Remove
        updatedItems = prevItems.filter((item, _index) => _index !== index);
      } else {
        updatedItems = prevItems.map((item, _index) => {
          if (index === _index) {
            const updatedSubTotal = newQuantity * item.product.sell_price;
            return {
              ...item,
              quantity: newQuantity,
              subTotal: updatedSubTotal,
            };
          }
          return item;
        });
      }

      // Call updateTotals after changing the quantity
      updateTotals(updatedItems, voucher);
      return updatedItems;
    });
  };

  const changeVoucher = (voucher: POSVoucher | undefined) => {
    setVoucher(() => {
      updateTotals(items, voucher);
      return voucher;
    });
  };

  const changePaymentMethod = (paymentMethod: POSPaymentMethod) => {
    setPmCode(paymentMethod.code);
    setPaymentMethod(paymentMethod);
  };

  const clearPos = () => {
    setItems([]);
    setTotalAmount(0);
    setTotalItems(0);
    setMember(undefined);
    setVoucher(undefined);
    changePaymentMethod(defaultPm);
    setAppOrder(undefined);
  };

  const handlePreCheckout = () => {
    if (totalItems === 0) {
      message.error('Mohon pilih produk');
      return;
    }

    setOpenCheckoutModal(true);
  };

  const handleCheckout = async (cash_received: number | null = null) => {
    const data = {
      store_id: storeId,
      app_order_id: appOrder?.id ?? null,
      payment_method_id: paymentMethod.id,
      cash_received: cash_received,
      member_id: member?.id ?? null,
      voucher_id: voucher?.id ?? null,
      items: items.map((e) => ({
        product_id: e.product_id,
        quantity: e.quantity,
      })),
    };

    // console.log(data);
    const response = await storeTransaction(data);
    const trx = response.data;
    setprintableTrx(trx);
  };

  const printTrx = (transaction: POSTransaction) => {
    setprintableTrx(transaction);
  };

  const printSuccess = () => {
    setprintableTrx(undefined);
  };

  const prepareAppOrder = async (id: number) => {
    setPageLoading(true);
    const newAppOrder = (await getAppOrderDetail(id)).data;
    setItems(() => {
      let newItems: POSItem[] = newAppOrder.items.map((item) => {
        const newItem: POSItem = {
          product: {
            id: item.product_id,
            sell_price: item.unit_price,
            name: item.product_name,
            sku: item.product_sku,
            stock: 0,
          },
          product_id: item.product_id,
          quantity: item.quantity,
          subTotal: item.total_price,
        };
        return newItem;
      });
      updateTotals(newItems);
      return newItems;
    });

    setPaymentMethod(newAppOrder.payment_method);
    setMember(newAppOrder.user.member!);
    setAppOrder(newAppOrder);
    setPageLoading(false);
  };

  return {
    storeId,
    setStoreId,
    pageLoading,
    items,
    totalAmount,
    totalItems,
    addItem,
    changeQuantity,
    member,
    setMember,
    voucher,
    changeVoucher,
    paymentMethod,
    pmCode,
    changePaymentMethod,
    clearPos,
    handlePreCheckout,
    openCheckoutModal,
    setOpenCheckoutModal,
    handleCheckout,
    printableTrx,
    printTrx,
    printSuccess,
    openTrxDrawer,
    setOpenTrxDrawer,
    appOrder,
    prepareAppOrder,
  };
};
