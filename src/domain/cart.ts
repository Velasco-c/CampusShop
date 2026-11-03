import type { CartItem } from './types';

export const MAX_QTY = 99;
export const FREE_SHIPPING_FROM = 100;
export const SHIPPING_FEE = 6.5;

export const round2 = (n: number): number => Math.round(n * 100) / 100;

export const cartLineKey = (productId: number, size: string): string => `${productId}-${size}`;

export const clampQty = (n: number): number => Math.min(MAX_QTY, Math.max(1, Math.floor(n) || 1));

export function cartTotals(items: CartItem[]) {
  const count = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = round2(items.reduce((s, i) => s + i.price * i.quantity, 0));
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
  return { count, subtotal, shipping, total: round2(subtotal + shipping) };
}
