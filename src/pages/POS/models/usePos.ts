// usePos.ts
import {
  POSItem,
  POSMember,
  POSPaymentMethod,
  POSProduct,
  POSVoucher,
  mapPMCode,
} from '@/pages/POS/data/data';
import { message } from 'antd';
import { useState } from 'react';
import { storeTransaction } from '../data/service';

const defaultPm: POSPaymentMethod = {
  id: 3,
  code: 'cash',
};

export default () => {
  const [items, setItems] = useState<POSItem[]>([]);
  const [member, setMember] = useState<POSMember | undefined>();
  const [voucher, setVoucher] = useState<POSVoucher | undefined>();

  const [pmCode, setPmCode] = useState<keyof typeof mapPMCode>('cash');
  const [paymentMethod, setPaymentMethod] = useState<POSPaymentMethod>(defaultPm);

  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const [openCheckoutModal, setOpenCheckoutModal] = useState<boolean>(false);

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
        const updatedItems = [...prevItems, newItem];
        // Call updateTotals after adding an item
        updateTotals(updatedItems);
        return updatedItems;
      });
    } else {
      setItems((prevItems) => {
        const updatedItems = prevItems.map((item) => {
          if (item.product_id === product.id) {
            const updatedQuantity = item.quantity + 1;
            const updatedSubTotal = updatedQuantity * item.product.sell_price;
            return {
              ...item,
              quantity: updatedQuantity,
              sub_total: updatedSubTotal,
            };
          }
          return item;
        });
        // Call updateTotals after updating the item
        updateTotals(updatedItems);
        return updatedItems;
      });
    }

    message.success('Berhasil menambahkan produk', 1);
  };

  const changeQuantity = (index: number, newQuantity: number) => {
    setItems((prevItems) => {
      var updatedItems: POSItem[] = [];
      if (newQuantity == 0) {
        // Remove
        updatedItems = prevItems.filter((item, _index) => _index != index);
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
      updateTotals(updatedItems);
      return updatedItems;
    });
  };

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

  const changeVoucher = (voucher: POSVoucher | undefined) => {
    setVoucher((_) => {
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
  };

  const handlePreCheckout = () => {
    if (totalItems == 0) {
      message.error('Mohon pilih produk');
      return;
    }

    setOpenCheckoutModal(true);
  };

  const handleCheckout = async () => {
    const data = {
      // TODO: Change Store
      store_id: 1,
      payment_method_id: paymentMethod.id,
      member_id: member?.id ?? null,
      items: items.map((e) => ({
        product_id: e.product_id,
        quantity: e.quantity,
      })),
    };

    // console.log(data);
    const response = await storeTransaction(data);

    return response.data;
  };

  return {
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
  };
};
