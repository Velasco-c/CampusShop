import { FASHION_CATEGORIES, PRICE_OPTIONS, SORT_OPTIONS } from '../../content/site';
import type { SortKey } from '../../domain/types';
import { TabBar, type TabItem } from '../ui/TabBar';

export type FilterPatch = Partial<Record<'q' | 'cat' | 'max' | 'sort', string | null>>;

interface FilterBarProps {
  q: string;
  category: string | null;
  maxPrice: number | null;
  sort: SortKey;
  onChange: (patch: FilterPatch) => void;
}

const CATEGORY_TABS: TabItem[] = [
  { id: 'all', label: 'Todo' },
  ...FASHION_CATEGORIES.map((c) => ({ id: c.slug, label: c.label })),
];

export function FilterBar({ q, category, maxPrice, sort, onChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-search">
        <input
          type="search"
          value={q}
          placeholder="Buscar en el catálogo..."
          aria-label="Buscar en el catálogo"
          onChange={(e) => onChange({ q: e.target.value || null })}
        />
      </div>

      <TabBar
        label="Categorías"
        items={CATEGORY_TABS}
        value={category ?? 'all'}
        onChange={(id) => onChange({ cat: id === 'all' ? null : id })}
      />

      <div className="filter-selects">
        <label>
          <span>Precio</span>
          <select value={maxPrice ?? ''} onChange={(e) => onChange({ max: e.target.value || null })}>
            {PRICE_OPTIONS.map((o) => (
              <option key={o.label} value={o.value ?? ''}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Ordenar</span>
          <select value={sort} onChange={(e) => onChange({ sort: e.target.value === 'relevance' ? null : e.target.value })}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
