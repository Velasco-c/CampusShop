import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { useOrders } from '../store/orderStore';
import { useCart } from '../store/cartStore';
import { formatDate, formatMoney } from '../utils/format';
import { EmptyState } from '../components/ui/States';
import { Icon } from '../components/ui/Icon';
import { CurtainLink, enterProps, FadeIn } from '../engine/transitions';

export default function ProfilePage() {
  const profileName = useOrders((s) => s.profileName);
  const orders = useOrders((s) => s.orders);
  const setProfileName = useOrders((s) => s.setProfileName);
  const clearLocalData = useOrders((s) => s.clearLocalData);
  const [name, setName] = useState(profileName);
  const [saved, setSaved] = useState(false);

  const onSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileName(name.trim());
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  };

  const onReset = () => {
    if (!window.confirm('¿Borrar tu historial y tu carrito de este navegador?')) return;
    clearLocalData();
    useCart.getState().clear();
    setName('');
  };

  return (
    <section className="container page">
      <FadeIn>
        <p className="eyebrow">Cuenta local</p>
        <h1 className="page-title">Perfil</h1>
        <form className="profile-form" onSubmit={onSave}>
          <label>
            <span>Nombre para tus pedidos</span>
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </label>
          <button type="submit" className="btn">
            {saved ? 'Guardado' : 'Guardar'}
          </button>
        </form>
      </FadeIn>

      <FadeIn>
        <h2 className="section-title">Historial de pedidos</h2>
      </FadeIn>

      {orders.length === 0 ? (
        <EmptyState
          title="Aún no tienes pedidos"
          text="Tus compras simuladas aparecerán aquí."
          action={
            <CurtainLink to="/catalogo" className="btn">
              Ir al catálogo
            </CurtainLink>
          }
        />
      ) : (
        <ul className="orders">
          {orders.map((o, i) => (
            <motion.li key={o.id} {...enterProps(i)}>
              <CurtainLink to={`/pedido/${o.id}`} className="order-card">
                <span className="order-card__icon">
                  <Icon name="package" />
                </span>
                <span className="order-card__info">
                  <strong>{o.id}</strong>
                  <span className="meta">
                    {formatDate(o.createdAt)} · {o.items.length} artículos
                  </span>
                </span>
                <span className={`estado ${o.status.replace(' ', '-')}`}>{o.status}</span>
                <strong className="order-card__total">{formatMoney(o.total)}</strong>
              </CurtainLink>
            </motion.li>
          ))}
        </ul>
      )}

      <FadeIn>
        <button type="button" className="btn btn--ghost danger" onClick={onReset}>
          Borrar datos locales
        </button>
      </FadeIn>
    </section>
  );
}
