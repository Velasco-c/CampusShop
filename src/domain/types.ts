// Modelo de dominio: independiente de React, del DOM y de la API externa.

export type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'rating';
export type PaymentMethod = 'tarjeta-simulada' | 'paypal-simulado' | 'contra-entrega';
export type OrderStatus = 'confirmado' | 'en camino' | 'entregado';

export interface Product {
  id: number;
  title: string;
  brand: string;
  description: string;
  category: string;
  price: number; // precio final en USD (ya con descuento)
  listPrice: number; // precio de lista en USD
  discountPercentage: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
  tags: string[];
}

export interface CartItem {
  key: string; // `${productId}-${size}`
  productId: number;
  title: string;
  brand: string;
  thumbnail: string;
  price: number;
  size: string;
  quantity: number;
}

export interface Customer {
  name: string;
  email: string;
  address: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  total: number;
  customer: Customer;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
}

export interface CatalogFilters {
  q: string;
  category: string | null;
  maxPrice: number | null;
  sort: SortKey;
}
