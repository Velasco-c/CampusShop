import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../store/cartStore';
import { useOrders } from '../store/orderStore';
import { cartTotals } from '../domain/cart';
import type { Customer, PaymentMethod } from '../domain/types';
import { PAYMENT_METHODS } from '../content/site';
import { formatMoney } from '../utils/format';
import { EmptyState } from '../components/ui/States';
import { CurtainLink, FadeIn, useCurtain } from '../engine/transitions';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
type Errors = Partial<Record<keyof Customer, string>>;

function validate(c: Customer): Errors {
  const errors: Errors = {};
  if (c.name.trim().length < 3) errors.name = 'Escribe tu nombre completo.';
  if (!EMAIL_RE.test(c.email.trim())) errors.email = 'Correo no válido.';
  if (c.address.trim().length < 8) errors.address = 'Dirección demasiado corta.';
  return errors;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { run } = useCurtain();
  const items = useCart((s) => s.items);
  const profileName = useOrders((s) => s.profileName);
  const totals = cartTotals(items);

  const [form, setForm] = useState<Customer>({ name: profileName, email: '', address: '' });
  const [method, setMethod] = useState<PaymentMethod>('tarjeta-simulada');
  const [errors, setErrors] = useState<Errors>({});
  const [processing, setProcessing] = useState(false);

  if (items.length === 0 && !processing) {
    return (
      <section className="container page">
        <EmptyState
          title="No hay nada que pagar"
          text="Tu carrito está vacío."
          action={
            <CurtainLink to="/catalogo" className="btn btn--solid">
              Ver catálogo
            </CurtainLink>
          }
        />
      </section>
    );
  }

  const update = (field: keyof Customer) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length > 0 || processing) return;

    setProcessing(true);
    // Simula el procesamiento del pago. No hay cobro real.
    window.setTimeout(() => {
      const customer: Customer = {
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
      };
      const orders = useOrders.getState();
      const order = orders.placeOrder(useCart.getState().items, customer, method);
      orders.setProfileName(customer.name);
      useCart.getState().clear();
      void run(() => navigate(`/pedido/${order.id}`, { replace: true }));
    }, 900);
  };

  return (
    <section className="container page">
      <FadeIn>
        <p className="eyebrow">Último paso</p>
        <h1 className="page-title">Checkout</h1>
        <p className="meta">Compra simulada. No se solicitan datos de tarjeta.</p>
      </FadeIn>

      <form className="checkout-form" onSubmit={onSubmit} noValidate>
        <div className="checkout-form__main">
          <fieldset>
            <legend>Datos de entrega</legend>
            <label>
              <span>Nombre completo</span>
              <input value={form.name} onChange={update('name')} autoComplete="name" aria-invalid={!!errors.name} />
              {errors.name && <small role="alert">{errors.name}</small>}
            </label>
            <label>
              <span>Correo</span>
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                autoComplete="email"
                aria-invalid={!!errors.email}
              />
              {errors.email && <small role="alert">{errors.email}</small>}
            </label>
            <label>
              <span>Dirección</span>
              <textarea
                rows={3}
                value={form.address}
                onChange={update('address')}
                autoComplete="street-address"
                aria-invalid={!!errors.address}
              />
              {errors.address && <small role="alert">{errors.address}</small>}
            </label>
          </fieldset>

          <fieldset>
            <legend>Método de pago (simulado)</legend>
            <div className="method-grid">
              {PAYMENT_METHODS.map((m) => (
                <label key={m.id} className={`method${method === m.id ? ' is-on' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={method === m.id}
                    onChange={() => setMethod(m.id)}
                  />
                  <span>{m.label}</span>
                  <small>{m.hint}</small>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <aside className="summary">
          <h2>Tu pedido</h2>
          <ul className="mini-list">
            {items.map((i) => (
              <li key={i.key}>
                <span>
                  {i.title} × {i.quantity} <em>({i.size})</em>
                </span>
                <span>{formatMoney(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl>
            <div>
              <dt>Envío</dt>
              <dd>{totals.shipping === 0 ? 'Gratis' : formatMoney(totals.shipping)}</dd>
            </div>
            <div className="summary__total">
              <dt>Total</dt>
              <dd>{formatMoney(totals.total)}</dd>
            </div>
          </dl>
          <button type="submit" className="btn btn--solid btn--wide" disabled={processing}>
            {processing ? 'Procesando…' : 'Confirmar compra'}
          </button>
        </aside>
      </form>
    </section>
  );
}
