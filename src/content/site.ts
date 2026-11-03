import type { PaymentMethod, SortKey } from '../domain/types';

export const SITE = {
  name: 'CampusShop',
  tagline: 'Dark fashion para el campus',
  credit: '© 2026 | Carlos Tzoy',
  socials: [
    { label: 'GitHub', href: 'https://github.com/Velasco-c' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/carlos-velasco-0b1b80278' },
    { label: 'Instagram', href: 'https://www.instagram.com/ve.lasco319' },
  ],
} as const;

/**
 * Categorías de moda consultadas a DummyJSON (https://dummyjson.com).
 * Solo se listan slugs de ropa, calzado y accesorios.
 */
export const FASHION_CATEGORIES: { slug: string; label: string }[] = [
  { slug: 'mens-shirts', label: 'Camisas' },
  { slug: 'tops', label: 'Tops' },
  { slug: 'womens-dresses', label: 'Vestidos' },
  { slug: 'mens-shoes', label: 'Calzado hombre' },
  { slug: 'womens-shoes', label: 'Calzado mujer' },
  { slug: 'womens-bags', label: 'Bolsos' },
  { slug: 'womens-jewellery', label: 'Joyería' },
  { slug: 'mens-watches', label: 'Relojes hombre' },
  { slug: 'womens-watches', label: 'Relojes mujer' },
  { slug: 'sunglasses', label: 'Gafas de sol' },
];

export const categoryLabel = (slug: string): string =>
  FASHION_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

export const PRICE_OPTIONS: { label: string; value: number | null }[] = [
  { label: 'Cualquier precio', value: null },
  { label: 'Hasta $25', value: 25 },
  { label: 'Hasta $75', value: 75 },
  { label: 'Hasta $150', value: 150 },
  { label: 'Hasta $300', value: 300 },
];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor valorados' },
];

// Imágenes originales del carrusel de CampusShop (optimizadas, sin cambios de contenido).
export const HERO_SLIDES = [
  { src: `${import.meta.env.BASE_URL}assets/hero-1.jpg`, alt: 'Moda 1', kicker: 'Temporada 2026', title: 'Nueva Colección', text: 'Dark fashion para el campus' },
  { src: `${import.meta.env.BASE_URL}assets/hero-2.jpg`, alt: 'Moda 2', kicker: 'Edición limitada', title: 'Estilo Nocturno', text: 'Negro, textura y silueta' },
  { src: `${import.meta.env.BASE_URL}assets/hero-3.jpg`, alt: 'Moda 3', kicker: 'Urbano', title: 'Cultura Callejera', text: 'Piezas para cada día' },
];

// Rejilla editorial original con sus leyendas.
export const LOOKBOOK = [
  { src: `${import.meta.env.BASE_URL}assets/look-4.jpg`, alt: 'Colección Ejecutiva', caption: 'Colección Ejecutiva - Edición Negra' },
  { src: `${import.meta.env.BASE_URL}assets/look-5.jpg`, alt: 'Moda Urbana', caption: 'Moda Urbana Casual - Otoño 2026' },
  { src: `${import.meta.env.BASE_URL}assets/look-6.jpg`, alt: 'Estilo Urbano', caption: 'Estilo Urbano - Chaqueta de Mezclilla' },
  { src: `${import.meta.env.BASE_URL}assets/look-7.jpg`, alt: 'Cultura Callejera', caption: 'Cultura Callejera - Estilo Nocturno' },
];

export const PAYMENT_METHODS: { id: PaymentMethod; label: string; hint: string }[] = [
  { id: 'tarjeta-simulada', label: 'Tarjeta', hint: 'Simulado' },
  { id: 'paypal-simulado', label: 'PayPal', hint: 'Simulado' },
  { id: 'contra-entrega', label: 'Contra entrega', hint: 'Simulado' },
];
