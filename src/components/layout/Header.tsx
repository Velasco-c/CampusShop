import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useCart } from '../../store/cartStore';
import { SITE } from '../../content/site';
import { CurtainLink, EASE_OUT, useCurtain } from '../../engine/transitions';
import { Icon } from '../ui/Icon';

interface HeaderProps {
  menuOpen: boolean;
  onToggleMenu: () => void;
}

export function Header({ menuOpen, onToggleMenu }: HeaderProps) {
  const navigate = useNavigate();
  const { run } = useCurtain();
  const [query, setQuery] = useState('');
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = query.trim();
    const target = q ? `/catalogo?q=${encodeURIComponent(q)}` : '/catalogo';
    void run(() => navigate(target));
  };

  return (
    <header className="site-header">
      <button
        type="button"
        className="icon-btn"
        aria-expanded={menuOpen}
        aria-controls="side-menu"
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        onClick={onToggleMenu}
      >
        <Icon name={menuOpen ? 'close' : 'menu'} />
      </button>

      <CurtainLink to="/" className="brand" aria-label={`${SITE.name}, inicio`}>
        <img src={`${import.meta.env.BASE_URL}assets/logo.png`} alt="" />
      </CurtainLink>

      <form className="search" role="search" onSubmit={onSubmit}>
        <Icon name="search" className="search__icon" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar productos"
          aria-label="Buscar productos"
        />
      </form>

      <nav className="header-actions" aria-label="Acciones de usuario">
        <CurtainLink to="/perfil" className="icon-btn" aria-label="Perfil e historial">
          <Icon name="user" />
        </CurtainLink>
        <CurtainLink to="/carrito" className="icon-btn cart-btn" aria-label={`Carrito, ${count} artículos`}>
          <Icon name="bag" />
          <AnimatePresence initial={false}>
            {count > 0 && (
              <motion.span
                key={count}
                className="badge"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.22, ease: EASE_OUT }}
              >
                {count}
              </motion.span>
            )}
          </AnimatePresence>
        </CurtainLink>
      </nav>
    </header>
  );
}
