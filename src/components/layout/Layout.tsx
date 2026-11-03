import { useCallback, useState, type ReactNode } from 'react';
import { Header } from './Header';
import { SideMenu } from './SideMenu';
import { Footer } from './Footer';

export function Layout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Header menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((o) => !o)} />
      <SideMenu open={menuOpen} onClose={closeMenu} />
      {children}
      <Footer />
    </>
  );
}
