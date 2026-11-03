import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { FASHION_CATEGORIES } from '../../content/site';
import { CurtainLink, EASE_OUT } from '../../engine/transitions';

const MAIN_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/carrito', label: 'Carrito' },
  { to: '/perfil', label: 'Perfil e historial' },
];

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

export function SideMenu({ open, onClose }: SideMenuProps) {
  const { pathname, search } = useLocation();

  // Cierra el menú cuando cambia la ruta.
  useEffect(() => {
    onClose();
  }, [pathname, search, onClose]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, handleKey]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            className="menu-scrim"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.aside
            key="menu"
            id="side-menu"
            className="side-menu"
            aria-label="Menú principal"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
          >
            <ul className="menu-list">
              {MAIN_LINKS.map((l, i) => (
                <motion.li
                  key={l.to}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.08 + i * 0.03 }}
                >
                  <CurtainLink to={l.to} className="menu-link">
                    {l.label}
                  </CurtainLink>
                </motion.li>
              ))}
            </ul>

            <p className="menu-caption">Categorías</p>
            <ul className="menu-list">
              {FASHION_CATEGORIES.map((c, i) => (
                <motion.li
                  key={c.slug}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.2 + i * 0.02 }}
                >
                  <CurtainLink to={`/catalogo?cat=${c.slug}`} className="menu-link menu-link--sub">
                    {c.label}
                  </CurtainLink>
                </motion.li>
              ))}
            </ul>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
