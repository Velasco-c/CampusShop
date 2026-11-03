# CampusShop · Dark Fashion

Tienda de moda para el campus. Catálogo con búsqueda y filtros, detalle de producto,
carrito persistente, checkout simulado e historial de pedidos.

Es un proyecto de portafolio: no procesa pagos reales ni tiene backend propio.

## Stack

- React 19 + TypeScript (estricto) + Vite
- React Router 7 (filtros en la URL)
- Motion (`motion/react`) para toda la animación
- Zustand con `persist` (carrito y pedidos en `localStorage`)
- TanStack Query (datos y estados de carga/error)
- API pública: [DummyJSON](https://dummyjson.com), sin clave

## Ejecutar

```bash
npm install
npm run dev        # http://localhost:5501
npm run build      # typecheck + build en dist/
npm run preview
```

## Estructura

```
src/
├── content/      Textos, categorías, slides y enlaces (un solo lugar para editar contenido)
├── domain/       Lógica pura: filtros, orden, tallas, totales, pedidos. Sin React.
├── services/     Cliente REST. Único módulo que conoce el formato de la API.
├── hooks/        Datos con TanStack Query
├── store/        Carrito y pedidos persistentes (Zustand)
├── engine/       Movimiento: cortina, entradas, números animados
├── components/
│   ├── layout/   Cabecera, menú, pie
│   ├── home/     Carrusel
│   ├── catalog/  Tarjeta, barra de filtros, coverflow
│   └── ui/       Iconos, pestañas, estados
├── pages/        Una página por ruta
└── styles/       tokens · base · layout · pages
```

La dependencia va en una sola dirección: `pages → components/hooks/store → domain`.

## Diseño

- **Paleta**: negro, blanco y grises. El degradado rosa/lavanda del original se usa solo
  en la línea activa de las pestañas, la barra del carrusel y el contador del carrito.
- **Tipografía**: Bebas Neue para títulos, Playfair Display en cursiva para etiquetas e
  Inter para el texto.
- **Iconos**: un único set propio (`components/ui/Icon.tsx`), trazo de 1.6 px y esquinas
  redondeadas. No se mezclan iconos de otras fuentes.
- **Logo**: se muestra en blanco para mantener la paleta monocromática.

Cada animación está justificada en [`docs/MOTION.md`](docs/MOTION.md).

## Notas de alcance

- **Catálogo**: se consultan 10 categorías de moda en paralelo. Si una falla, las demás siguen disponibles.
- **Tallas**: la API no las provee. Se derivan de la categoría (ropa, calzado o talla única).
- **Pago**: el checkout no pide datos de tarjeta. El método de pago está marcado como simulado.
- **Imágenes**: carrusel y lookbook usan las imágenes originales de CampusShop, optimizadas a JPEG.
