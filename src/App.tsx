import { Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig, motion } from 'motion/react';
import { Layout } from './components/layout/Layout';
import { CurtainProvider, pageVariants } from './engine/transitions';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderPage from './pages/OrderPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const location = useLocation();

  return (
    // reducedMotion="user" desactiva los desplazamientos si el sistema lo pide.
    <MotionConfig reducedMotion="user">
      <CurtainProvider>
        <Layout>
          <motion.main
            key={location.pathname}
            id="contenido"
            className="route-view"
            variants={pageVariants}
            initial="initial"
            animate="enter"
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalogo" element={<CatalogPage />} />
              <Route path="/producto/:id" element={<ProductPage />} />
              <Route path="/carrito" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/pedido/:id" element={<OrderPage />} />
              <Route path="/perfil" element={<ProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </motion.main>
        </Layout>
      </CurtainProvider>
    </MotionConfig>
  );
}
