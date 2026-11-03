// Coverflow: el elemento activo queda al centro y los demás se giran hacia atrás.
// Solo muestra productos reales (sin repetir). Se navega con clic, flechas o teclado.
import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EASE_OUT } from '../../engine/transitions';
import { Icon } from '../ui/Icon';

interface CoverflowRowProps<T extends { id: number }> {
  items: T[];
  render: (item: T) => ReactNode;
  label: string;
}

const STEP = 230; // separación horizontal entre posiciones (px)
const ANGLE = 40; // giro de los laterales (grados)
const VISIBLE = 2; // posiciones visibles a cada lado del activo

export function CoverflowRow<T extends { id: number }>({ items, render, label }: CoverflowRowProps<T>) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const last = items.length - 1;
  const go = (i: number) => setActive(Math.min(Math.max(i, 0), last));

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(active + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(active - 1);
    }
  };

  return (
    <div className="coverflow" role="region" aria-label={label} tabIndex={0} onKeyDown={onKeyDown}>
      <div className="coverflow__stage">
        {items.map((item, i) => {
          const d = i - active;
          const dist = Math.abs(d);
          const visible = dist <= VISIBLE;

          return (
            <motion.div
              key={item.id}
              className="coverflow__slot"
              inert={!visible}
              style={{ pointerEvents: visible ? 'auto' : 'none' }}
              animate={{
                x: d * STEP,
                rotateY: d === 0 ? 0 : d < 0 ? ANGLE : -ANGLE,
                scale: 1 - Math.min(dist, VISIBLE) * 0.12,
                opacity: visible ? 1 : 0,
                filter: d === 0 ? 'brightness(1)' : 'brightness(0.55)',
                zIndex: 10 - dist,
              }}
              transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE_OUT }}
              onClickCapture={(event) => {
                // Un lateral solo se activa; el activo conserva su enlace.
                if (d !== 0) {
                  event.preventDefault();
                  event.stopPropagation();
                  go(i);
                }
              }}
            >
              {render(item)}
            </motion.div>
          );
        })}
      </div>

      <div className="coverflow__controls">
        <button type="button" className="icon-btn" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Anterior">
          <Icon name="arrow-left" />
        </button>
        <span className="coverflow__count" aria-live="polite">
          {active + 1} / {items.length}
        </span>
        <button
          type="button"
          className="icon-btn"
          onClick={() => go(active + 1)}
          disabled={active === last}
          aria-label="Siguiente"
        >
          <Icon name="arrow-right" />
        </button>
      </div>
    </div>
  );
}
