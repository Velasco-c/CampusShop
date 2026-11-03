import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useCatalog, useProduct } from '../hooks/useCatalog';
import { useCart } from '../store/cartStore';
import { sizesFor } from '../domain/catalog';
import { MAX_QTY } from '../domain/cart';
import { categoryLabel } from '../content/site';
import { formatMoney } from '../utils/format';
import { CurtainLink, EASE_OUT, FadeIn } from '../engine/transitions';
import { ProductCard } from '../components/catalog/ProductCard';
import { CoverflowRow } from '../components/catalog/CoverflowRow';
import { TabBar } from '../components/ui/TabBar';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorState, SkeletonGrid } from '../components/ui/States';
import type { Product } from '../domain/types';

export default function ProductPage() {
  const { id } = useParams();
  const productId = Number(id);
  const { data: product, isPending, isError, refetch } = useProduct(productId);

  if (!Number.isInteger(productId) || productId < 1) {
    return (
      <section className="container page">
        <EmptyState
          title="Producto no encontrado"
          text="El identificador del producto no es válido."
          action={
            <CurtainLink to="/catalogo" className="btn btn--solid">
              Volver al catálogo
            </CurtainLink>
          }
        />
      </section>
    );
  }

  if (isPending) {
    return (
      <section className="container page">
        <SkeletonGrid count={1} />
      </section>
    );
  }

  if (isError || !product) {
    return (
      <section className="container page">
        <ErrorState message="No encontramos este producto." onRetry={() => refetch()} />
        <p className="center">
          <CurtainLink to="/catalogo" className="inline-link">
            Volver al catálogo
          </CurtainLink>
        </p>
      </section>
    );
  }

  return <ProductView key={product.id} product={product} />;
}

function ProductView({ product }: { product: Product }) {
  const sizes = sizesFor(product.category);
  const [size, setSize] = useState(sizes[0]);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const { data: catalog } = useCatalog();

  const gallery = product.images.slice(0, 5);
  const related = (catalog ?? []).filter((p) => p.category === product.category && p.id !== product.id).slice(0, 8);
  const onSale = product.listPrice > product.price;

  // La confirmación "Añadido" dura 1.6 s y vuelve sola al estado normal.
  useEffect(() => {
    if (!added) return;
    const t = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(t);
  }, [added]);

  const onAdd = () => {
    addItem(product, size, qty);
    setAdded(true);
  };

  return (
    <>
      <section className="container product-detail">
        <FadeIn className="gallery">
          <div className="gallery__main">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={gallery[active]}
                src={gallery[active]}
                alt={product.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
              />
            </AnimatePresence>
          </div>
          <div className="gallery__thumbs">
            {gallery.map((src, i) => (
              <button
                key={src}
                type="button"
                className={`gallery__thumb${i === active ? ' is-active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`Ver imagen ${i + 1}`}
                aria-pressed={i === active}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </FadeIn>

        <FadeIn className="product-info" delay={0.08}>
          <p className="eyebrow">
            {product.brand} · {categoryLabel(product.category)}
          </p>
          <h1>{product.title}</h1>
          <p className="price-lg">
            {formatMoney(product.price)}
            {onSale && <s>{formatMoney(product.listPrice)}</s>}
          </p>
          <p className="meta">
            Valoración {product.rating.toFixed(1)} · {product.stock} en existencia
          </p>
          <p className="description">{product.description}</p>

          <div className="option-group">
            <span className="option-label">Talla</span>
            <TabBar
              label="Talla"
              items={sizes.map((s) => ({ id: s, label: s }))}
              value={size}
              onChange={setSize}
            />
          </div>

          <div className="buy-row">
            <div className="stepper" role="group" aria-label="Cantidad">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Disminuir cantidad">
                <Icon name="minus" />
              </button>
              <output aria-live="polite">{qty}</output>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
                aria-label="Aumentar cantidad"
              >
                <Icon name="plus" />
              </button>
            </div>

            <button type="button" className={`btn btn--solid btn--wide${added ? ' is-added' : ''}`} onClick={onAdd}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={added ? 'ok' : 'add'}
                  className="btn__label"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  {added ? (
                    <>
                      <Icon name="check" drawIn />
                      Añadido
                    </>
                  ) : (
                    'Añadir al carrito'
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>

          {added && (
            <CurtainLink to="/carrito" className="inline-link">
              Ir al carrito <Icon name="arrow-right" />
            </CurtainLink>
          )}
        </FadeIn>
      </section>

      {related.length >= 3 && (
        <section className="container section">
          <h2 className="section-title">También en {categoryLabel(product.category)}</h2>
          <CoverflowRow<Product> items={related} label="Productos relacionados" render={(p) => <ProductCard product={p} />} />
        </section>
      )}
    </>
  );
}
