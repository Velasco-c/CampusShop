import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { CartItem, Customer, Order, PaymentMethod } from '../domain/types';
import { buildOrder } from '../domain/orders';

interface OrderState {
  orders: Order[];
  profileName: string;
  placeOrder: (items: CartItem[], customer: Customer, method: PaymentMethod) => Order;
  setProfileName: (name: string) => void;
  clearLocalData: () => void;
}

export const useOrders = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      profileName: '',
      placeOrder: (items, customer, method) => {
        const order = buildOrder(items, customer, method);
        set({ orders: [order, ...get().orders] });
        return order;
      },
      setProfileName: (profileName) => set({ profileName }),
      clearLocalData: () => set({ orders: [], profileName: '' }),
    }),
    { name: 'campushop-orders', storage: createJSONStorage(() => localStorage), version: 1 },
  ),
);
