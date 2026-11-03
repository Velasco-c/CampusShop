import type { CatalogFilters, Product, SortKey } from './types';

const fold = (s: string): string =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/** Cada palabra de la búsqueda debe aparecer en algún campo del producto. */
export function matchesQuery(p: Product, q: string): boolean {
  const terms = fold(q).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = fold([p.title, p.brand, p.description, p.category, ...p.tags].join(' '));
  return terms.every((t) => haystack.includes(t));
}

export function sortProducts(list: Product[], sort: SortKey): Product[] {
  const copy = [...list];
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'rating':
      return copy.sort((a, b) => b.rating - a.rating);
    default:
      return copy;
  }
}

export function applyFilters(products: Product[], f: CatalogFilters): Product[] {
  const filtered = products.filter(
    (p) =>
      (!f.category || p.category === f.category) &&
      (f.maxPrice === null || p.price <= f.maxPrice) &&
      matchesQuery(p, f.q),
  );
  return sortProducts(filtered, f.sort);
}

const APPAREL = ['XS', 'S', 'M', 'L', 'XL'];
const SHOES = ['38', '39', '40', '41', '42', '43'];
const ONE_SIZE = ['Única'];

/** Las tallas no vienen de la API: se derivan de la categoría (simulado). */
export function sizesFor(category: string): string[] {
  if (category.includes('shoes')) return SHOES;
  if (['mens-shirts', 'tops', 'womens-dresses'].includes(category)) return APPAREL;
  return ONE_SIZE;
}
