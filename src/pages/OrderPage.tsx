import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useOrders } from '../store/orderStore';
import { formatDate, formatMoney } from '../utils/format';
import { EmptyState } from '../components/ui/States';
import { Icon } from '../components/ui/Icon';
import { CurtainLink, EASE_OUT, FadeIn } from '../engine/transitions';

const STEPS = ['confirmado', 'en camino', 'entregado'] as const;

export default function OrderPage() {
  const { id } = useParams();
  const order = useOrders((s) => s.orders.find((o) => o.id === id));

  if (!order) {
    return (
      <section className="container page">
        <EmptyState
          title="Pedido no encontrado"
          text="Revisa tu historial de pedidos."
          action={
            <CurtainLink to="/perfil" className="btn">
              Ir al historial
            </CurtainLink>
          }
        />
      </section>
    );
  }

  const stepIndex = STEPS.indexOf(order.status);
  const progress = stepIndex / (STEPS.length - 1);

  return (
    <section className="container page order">
      <FadeIn className="order__hero">
        <span className="order__badge">
          <Icon name="check" drawIn />
        </span>
        <p className="eyebrow">Pedido {order.id}</p>
        <h1 className="page-title">Gracias por tu compra</h1>
        <p className="meta">
          {formatDate(order.createdAt)} · {order.customer.name}
        </p>
      </FadeIn>

      <div className="timeline" aria-label={`Estado del pedido: ${order.status}`}>
        <div className="timeline__track" aria-hidden="true">
          <motion.span
            className="timeline__fill"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
          />
        </div>
        <ol className="timeline__steps">
          {STEPS.map((step, i) => (
            <li key={step} className={i <= stepIndex ? 'is-done' : ''}>
              <span className="timeline__dot" aria-hidden="true" />
              {step}
            </li>
          ))}
        </ol>
      </div>

      <ul className="order-items">
        {order.items.map((i) => (
          <li key={i.key} className="order-item">
            <img src={i.thumbnail} alt="" />
            <div>
              <h3>{i.title}</h3>
              <p className="meta">
                Talla {i.size} · {i.quantity} × {formatMoney(i.price)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="summary order__summary">
        <div className="summary__total">
          <span>Total pagado (simulado)</span>
          <strong>{formatMoney(order.total)}</strong>
        </div>
        <CurtainLink to="/catalogo" className="btn btn--solid btn--wide">
          Seguir comprando
        </CurtainLink>
      </div>
    </section>
  );
}
