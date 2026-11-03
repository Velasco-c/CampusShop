import type { Product } from '../domain/types';
import { FASHION_CATEGORIES } from '../content/site';

// API REST pública y sin autenticación: https://dummyjson.com
const BASE_URL = 'https://dummyjson.com';

export class ApiError extends Error {}

interface RawProduct {
  id: number;
  title: string;
  brand?: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  thumbnail: string;
  images?: string[];
  tags?: string[];
}

interface RawListResponse {
  products: RawProduct[];
}

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new ApiError(`La API respondió ${res.status} en ${path}`);
  return (await res.json()) as T;
}

/** Traduce el formato externo al modelo interno. Único punto que conoce la forma de la API. */
function normalize(raw: RawProduct): Product {
  const disc = raw.discountPercentage ?? 0;
  const price = Math.round(raw.price * (1 - disc / 100) * 100) / 100;
  return {
    id: raw.id,
    title: raw.title,
    brand: raw.brand ?? 'CampusShop Lab',
    description: raw.description,
    category: raw.category,
    price,
    listPrice: raw.price,
    discountPercentage: disc,
    rating: raw.rating ?? 0,
    stock: raw.stock ?? 0,
    thumbnail: raw.thumbnail,
    images: raw.images?.length ? raw.images : [raw.thumbnail],
    tags: raw.tags ?? [],
  };
}

async function fetchCategory(slug: string, signal?: AbortSignal): Promise<Product[]> {
  const data = await getJson<RawListResponse>(`/products/category/${slug}`, signal);
  return data.products.map(normalize);
}

/** Combina todas las categorías de moda. Una categoría caída no tumba el catálogo. */
export async function fetchCatalog(signal?: AbortSignal): Promise<Product[]> {
  const results = await Promise.allSettled(FASHION_CATEGORIES.map((c) => fetchCategory(c.slug, signal)));
  const products = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
  if (products.length === 0) throw new ApiError('No fue posible cargar el catálogo.');
  return [...new Map(products.map((p) => [p.id, p])).values()];
}

export async function fetchProduct(id: number, signal?: AbortSignal): Promise<Product> {
  return normalize(await getJson<RawProduct>(`/products/${id}`, signal));
}
