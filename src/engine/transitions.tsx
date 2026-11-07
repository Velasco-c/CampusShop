// Movimiento de la tienda. Cada animación cumple una función concreta:
//  - Cortina: la única transición entre páginas. Confirma el cambio de ruta mientras
//    la nueva vista se monta detrás de ella.
//  - Entrada de página y tarjetas: fundidos breves sin desplazar el layout.
//  - Totales: cuentan hacia el valor nuevo para mostrar que cambiaron.
// Con prefers-reduced-motion (MotionConfig reducedMotion="user") se respetan las preferencias del sistema.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { animate } from 'motion';
import { motion, useMotionValue, useReducedMotion, useTransform, type Variants } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Entrada de cada página montada bajo la cortina. */
export const pageVariants: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.24, ease: EASE_OUT } },
};

/** Props de entrada escalonada para una tarjeta; el retraso máximo es de 175 ms. */
export function enterProps(index = 0) {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, ease: EASE_OUT, delay: Math.min(index, 5) * 0.035 },
  };
}

/** Bloque que aparece una sola vez al montar la página. */
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Número que se interpola hacia su valor nuevo. Usa un MotionValue para actualizar
 * el texto directamente en el DOM, sin re-renderizar React en cada frame.
 */
export function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const reduce = useReducedMotion();
  const number = useMotionValue(value);
  const text = useTransform(number, (v) => format(v));

  useEffect(() => {
    const controls = animate(number, value, { duration: reduce ? 0 : 0.45, ease: EASE_OUT });
    return () => controls.stop();
  }, [value, reduce, number]);

  return <motion.span>{text}</motion.span>;
}

// ---------------------------------------------------------------------------
// Cortina de transición entre páginas
// ---------------------------------------------------------------------------

type Update = () => void;
interface CurtainApi {
  run: (update: Update) => Promise<void>;
  pending: boolean;
}

const CurtainContext = createContext<CurtainApi | null>(null);
const SKEW = -10;

/** Espera dos frames: asegura que React haya pintado la nueva vista antes de revelarla. */
const nextPaint = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

export function CurtainProvider({ children }: { children: ReactNode }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const reduce = useReducedMotion();

  const run = useCallback(
    async (update: Update) => {
      if (busy.current) return; // ignora clics mientras la cortina se mueve
      busy.current = true;
      setPending(true);
      const panel = panelRef.current;
      try {
        if (panel && !reduce) {
          await animate(panel, { x: ['-120%', '0%'], skewX: [SKEW, SKEW] }, { duration: 0.32, ease: EASE_OUT })
            .finished;
        }
        update();
        await nextPaint();
        if (panel && !reduce) {
          await animate(panel, { x: ['0%', '120%'], skewX: [SKEW, SKEW] }, { duration: 0.36, ease: EASE_OUT })
            .finished;
        }
      } finally {
        busy.current = false;
        setPending(false);
      }
    },
    [reduce],
  );

  return (
    <CurtainContext.Provider value={{ run, pending }}>
      {children}
      <div className={`curtain-layer${pending ? ' is-pending' : ''}`} aria-hidden="true">
        <div ref={panelRef} className="curtain-panel" />
      </div>
    </CurtainContext.Provider>
  );
}

/** `run(update)` ejecuta el cambio de vista con la cortina. Sin proveedor, navega directo. */
export function useCurtain(): CurtainApi {
  const ctx = useContext(CurtainContext);
  if (ctx) return ctx;
  return { pending: false, run: async (update) => update() };
}

type LinkProps = ComponentProps<typeof Link>;

/** Link que navega con cortina. Ctrl/Cmd/Shift/Alt y clic derecho siguen el comportamiento nativo. */
export function CurtainLink({ to, onClick, ...rest }: LinkProps) {
  const navigate = useNavigate();
  const { run } = useCurtain();

  return (
    <Link
      to={to}
      {...rest}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        event.preventDefault();
        void run(() => navigate(to));
      }}
    />
  );
}
