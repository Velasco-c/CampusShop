// Set de iconos propio: viewBox 24, trazo único de 1.6 px y esquinas redondeadas.
// Todos heredan el color de texto (currentColor) y comparten el mismo peso visual.
import { motion } from 'motion/react';
import { EASE_OUT } from '../../engine/transitions';

const ICONS = {
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h10'],
  close: ['M6 6l12 12', 'M18 6L6 18'],
  search: ['M11 4.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13z', 'M16 16l4.5 4.5'],
  user: ['M8 8a4 4 0 1 0 8 0 4 4 0 1 0-8 0', 'M4.5 20c1.3-3.6 4-5.5 7.5-5.5s6.2 1.9 7.5 5.5'],
  bag: ['M5 8h14l-1 12H6z', 'M9 8V6.5a3 3 0 0 1 6 0V8'],
  trash: ['M4 7h16', 'M9.5 7V4.8h5V7', 'M6.5 7l1 12.2h9l1-12.2'],
  minus: ['M5 12h14'],
  plus: ['M12 5v14', 'M5 12h14'],
  'arrow-right': ['M5 12h14', 'M13 6l6 6-6 6'],
  'arrow-left': ['M19 12H5', 'M11 6l-6 6 6 6'],
  check: ['M5 12.5l4.5 4.5L19 7.5'],
  package: ['M12 3l8 4.2v9.6L12 21l-8-4.2V7.2z', 'M4 7.2l8 4.2 8-4.2', 'M12 11.4V21'],
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  /** Dibuja el trazo progresivamente. Úsalo solo para confirmar una acción. */
  drawIn?: boolean;
  className?: string;
}

export function Icon({ name, drawIn = false, className }: IconProps) {
  return (
    <svg className={className ? `icon ${className}` : 'icon'} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {ICONS[name].map((d, i) =>
        drawIn ? (
          <motion.path
            key={i}
            d={d}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.1 }}
          />
        ) : (
          <path key={i} d={d} />
        ),
      )}
    </svg>
  );
}
