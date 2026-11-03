import type { CartItem, Customer, Order, PaymentMethod } from './types';
import { cartTotals } from './cart';

export function buildOrder(
  items: CartItem[],
  customer: Customer,
  paymentMethod: PaymentMethod,
  now: Date = new Date(),
): Order {
  const { total } = cartTotals(items);
  return {
    id: `CS-${now.getTime().toString(36).toUpperCase()}`,
    createdAt: now.toISOString(),
    items,
    total,
    customer,
    paymentMethod,
    status: 'confirmado',
  };
}
