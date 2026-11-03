import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCatalog } from '../hooks/useCatalog';
import { applyFilters } from '../domain/catalog';
import type { CatalogFilters, Product, SortKey } from '../domain/types';
import { categoryLabel, FASHION_CATEGORIES } from '../content/site';
import { FilterBar, type FilterPatch } from '../components/catalog/FilterBar';
import { ProductCard } from '../components/catalog/ProductCard';
import { CoverflowRow } from '../components/catalog/CoverflowRow';
import { EmptyState, ErrorState, SkeletonGrid } from '../components/ui/States';
import { FadeIn } from '../engine/transitions';

const SORTS: SortKey[] = ['relevance', 'price-asc', 'price-desc', 'rating'];
/** Con menos productos, un coverflow no aporta; se muestra una rejilla. */
const COVERFLOW_MIN = 3;

// Los filtros viven en la URL: son compartibles y sobreviven a recargas.
function readFilters(params: URLSearchParams): CatalogFilters {
  const sort = params.get('sort') as SortKey | null;
  const rawMax = params.get('max');
  const max = rawMax === null || rawMax.trim() === '' ? Number.NaN : Number(rawMax);
  const cat = params.get('cat');
  return {
    q: params.get('q') ?? '',
    category: FASHION_CATEGORIES.some((c) => c.slug === cat) ? cat : null,
    maxPrice: Number.isFinite(max) && max >= 0 ? max : null,
    sort: sort && SORTS.includes(sort) ? sort : 'relevance',
  };
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}

export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => readFilters(params), [params]);
  const { data, isPending, isError, refetch } = useCatalog();

  const results = useMemo(() => (data ? applyFilters(data, filters) : []), [data, filters]);
  const groups = useMemo(
    () =>
      FASHION_CATEGORIES.map((c) => ({ ...c, products: results.filter((p) => p.category === c.slug) })).filter(
        (g) => g.products.length > 0,
      ),
    [results],
  );

  // Con búsqueda, categoría, precio u orden activos se muestra una rejilla plana.
  // Con "Todo" se muestra una sección por categoría, cada una en coverflow.
  const flat = Boolean(filters.category || filters.q || filters.maxPrice !== null || filters.sort !== 'relevance');

  const onChange = (patch: FilterPatch) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(patch)) {
      if (!['q', 'cat', 'max', 'sort'].includes(key)) continue;
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setParams(next, { replace: true });
  };

  const reset = () => setParams(new URLSearchParams(), { replace: true });

  return (
    <section className="container page">
      <FadeIn>
        <p className="eyebrow">Catálogo</p>
        <h1 className="page-title">{filters.category ? categoryLabel(filters.category) : 'Todas las prendas'}</h1>
      </FadeIn>

      <FadeIn delay={0.05}>
        <FilterBar
          q={filters.q}
          category={filters.category}
          maxPrice={filters.maxPrice}
          sort={filters.sort}
          onChange={onChange}
        />
      </FadeIn>

      {isPending && <SkeletonGrid count={8} />}
      {isError && <ErrorState message="No pudimos cargar el catálogo." onRetry={() => refetch()} />}

      {data && (
        <>
          <p className="results-count" aria-live="polite">
            {results.length} {results.length === 1 ? 'producto' : 'productos'}
          </p>

          {results.length === 0 ? (
            <EmptyState
              title="Sin resultados"
              text="Prueba con otra búsqueda o quita algunos filtros."
              action={
                <button type="button" className="btn" onClick={reset}>
                  Limpiar filtros
                </button>
              }
            />
          ) : flat ? (
            <ProductGrid products={results} />
          ) : (
            groups.map((g) => (
              <section key={g.slug} className="catalog-category">
                <h2 className="section-title">
                  {g.label} <span className="count">{g.products.length}</span>
                </h2>
                {g.products.length >= COVERFLOW_MIN ? (
                  <CoverflowRow<Product>
                    items={g.products}
                    label={`Productos de ${g.label}`}
                    render={(p) => <ProductCard product={p} />}
                  />
                ) : (
                  <ProductGrid products={g.products} />
                )}
              </section>
            ))
          )}
        </>
      )}
    </section>
  );
}
