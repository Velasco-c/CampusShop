import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { CartItem, Product } from '../domain/types';
import { cartLineKey, clampQty } from '../domain/cart';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, size: string, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

// El carrito persiste en localStorage: sobrevive a recargas y cierres del navegador.
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, size, quantity = 1) =>
        set((state) => {
          const key = cartLineKey(product.id, size);
          const exists = state.items.some((i) => i.key === key);
          if (exists) {
            return {
              items: state.items.map((i) =>
                i.key === key ? { ...i, quantity: clampQty(i.quantity + quantity) } : i,
              ),
            };
          }
          const line: CartItem = {
            key,
            productId: product.id,
            title: product.title,
            brand: product.brand,
            thumbnail: product.thumbnail,
            price: product.price,
            size,
            quantity: clampQty(quantity),
          };
          return { items: [...state.items, line] };
        }),
      setQuantity: (key, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.key === key ? { ...i, quantity: clampQty(quantity) } : i)),
        })),
      removeItem: (key) => set((state) => ({ items: state.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [] }),
    }),
    { name: 'campushop-cart', storage: createJSONStorage(() => localStorage), version: 1 },
  ),
);
