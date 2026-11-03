import { AnimatePresence, motion } from 'motion/react';
import { useCart } from '../store/cartStore';
import { cartTotals, FREE_SHIPPING_FROM, MAX_QTY } from '../domain/cart';
import { formatMoney } from '../utils/format';
import { EmptyState } from '../components/ui/States';
import { Icon } from '../components/ui/Icon';
import { AnimatedNumber, CurtainLink, EASE_OUT, FadeIn } from '../engine/transitions';

export default function CartPage() {
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const totals = cartTotals(items);

  if (items.length === 0) {
    return (
      <section className="container page">
        <FadeIn>
          <EmptyState
            title="Tu carrito está vacío"
            text="Explora el catálogo y agrega tus prendas favoritas."
            action={
              <CurtainLink to="/catalogo" className="btn btn--solid">
                Ir al catálogo
              </CurtainLink>
            }
          />
        </FadeIn>
      </section>
    );
  }

  const progress = Math.min(totals.subtotal / FREE_SHIPPING_FROM, 1);

  return (
    <section className="container page">
      <FadeIn>
        <p className="eyebrow">Tu selección</p>
        <h1 className="page-title">Carrito</h1>
      </FadeIn>

      <div className="cart-layout">
        <ul className="cart-list">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.li
                key={item.key}
                layout="position"
                className="cart-line"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
              >
                <img src={item.thumbnail} alt="" />
                <div className="cart-line__info">
                  <p className="eyebrow">{item.brand}</p>
                  <h3>{item.title}</h3>
                  <p className="meta">
                    Talla {item.size} · {formatMoney(item.price)}
                  </p>
                </div>
                <div className="cart-line__actions">
                  <div className="stepper" role="group" aria-label={`Cantidad de ${item.title}`}>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.key, item.quantity - 1)}
                      aria-label="Disminuir"
                    >
                      <Icon name="minus" />
                    </button>
                    <output>{item.quantity}</output>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.key, Math.min(MAX_QTY, item.quantity + 1))}
                      aria-label="Aumentar"
                    >
                      <Icon name="plus" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="icon-btn danger"
                    onClick={() => removeItem(item.key)}
                    aria-label={`Quitar ${item.title}`}
                  >
                    <Icon name="trash" />
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <aside className="summary">
          <h2>Resumen</h2>
          <div className="shipping">
            <p className="meta">
              {progress >= 1
                ? 'Tienes envío gratis'
                : `Te faltan ${formatMoney(FREE_SHIPPING_FROM - totals.subtotal)} para envío gratis`}
            </p>
            <div className="progress" aria-hidden="true">
              <motion.span
                className="progress__bar"
                animate={{ scaleX: progress }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              />
            </div>
          </div>
          <dl>
            <div>
              <dt>Artículos</dt>
              <dd>{totals.count}</dd>
            </div>
            <div>
              <dt>Subtotal</dt>
              <dd>
                <AnimatedNumber value={totals.subtotal} format={formatMoney} />
              </dd>
            </div>
            <div>
              <dt>Envío</dt>
              <dd>{totals.shipping === 0 ? 'Gratis' : formatMoney(totals.shipping)}</dd>
            </div>
            <div className="summary__total">
              <dt>Total</dt>
              <dd>
                <AnimatedNumber value={totals.total} format={formatMoney} />
              </dd>
            </div>
          </dl>
          <CurtainLink to="/checkout" className="btn btn--solid btn--wide">
            Ir a pagar <Icon name="arrow-right" />
          </CurtainLink>
          <p className="fineprint">Compra simulada: no se procesa ningún pago real.</p>
        </aside>
      </div>
    </section>
  );
}
