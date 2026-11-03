import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Hero } from '../components/home/Hero';
import { ProductCard } from '../components/catalog/ProductCard';
import { ErrorState, SkeletonGrid } from '../components/ui/States';
import { useCatalog } from '../hooks/useCatalog';
import { FASHION_CATEGORIES, LOOKBOOK } from '../content/site';
import { CurtainLink, enterProps, FadeIn } from '../engine/transitions';

export default function HomePage() {
  const { data, isPending, isError, refetch } = useCatalog();
  const featured = useMemo(
    () => (data ? [...data].sort((a, b) => b.rating - a.rating).slice(0, 4) : []),
    [data],
  );

  return (
    <>
      <Hero />

      <section className="container section">
        <FadeIn>
          <h2 className="section-title">Categorías</h2>
        </FadeIn>
        <div className="category-strip">
          {FASHION_CATEGORIES.slice(0, 6).map((c, i) => (
            <motion.div key={c.slug} {...enterProps(i)}>
              <CurtainLink to={`/catalogo?cat=${c.slug}`} className="category-tile">
                <span>{c.label}</span>
              </CurtainLink>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container section">
        <FadeIn>
          <h2 className="section-title">Destacados</h2>
        </FadeIn>
        {isPending && <SkeletonGrid count={4} />}
        {isError && <ErrorState message="No pudimos cargar los destacados." onRetry={() => refetch()} />}
        {data && (
          <div className="grid">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      <section className="container section">
        <FadeIn>
          <h2 className="section-title">Lookbook</h2>
        </FadeIn>
        <div className="lookbook">
          {LOOKBOOK.map((item, i) => (
            <motion.figure key={item.src} className="lookbook__item" {...enterProps(i)}>
              <img src={item.src} alt={item.alt} loading="lazy" />
              <figcaption>{item.caption}</figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      <section className="container cta-band">
        <h2>Explora la colección completa</h2>
        <CurtainLink to="/catalogo" className="btn btn--solid">
          Ver catálogo
        </CurtainLink>
      </section>
    </>
  );
}
