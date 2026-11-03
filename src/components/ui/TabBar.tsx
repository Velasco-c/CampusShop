import { useId } from 'react';
import { motion } from 'motion/react';

export interface TabItem {
  id: string;
  label: string;
}

interface TabBarProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  label: string;
}

/** Pestañas con línea compartida: la barra se desliza entre opciones (layoutId). */
export function TabBar({ items, value, onChange, label }: TabBarProps) {
  const groupId = useId();

  return (
    <div role="tablist" aria-label={label} className="tab-bar">
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={`tab${active ? ' is-active' : ''}`}
            onClick={() => onChange(item.id)}
          >
            {item.label}
            {active && (
              <motion.span
                layoutId={`tab-line-${groupId}`}
                className="tab__line"
                transition={{ type: 'spring', stiffness: 520, damping: 42 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
