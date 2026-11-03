import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { HERO_SLIDES } from '../../content/site';
import { CurtainLink, EASE_OUT } from '../../engine/transitions';

// La duración coincide con la animación CSS `dot-fill` (ver pages.css).
const INTERVAL_MS = 6000;

export function Hero() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const reduce = useReducedMotion();
  const autoplay = !reduce && !hovered;

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % HERO_SLIDES.length), INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [autoplay, index]);

  const slide = HERO_SLIDES[index];

  return (
    <section
      className={`hero${hovered ? ' is-paused' : ''}`}
      aria-roledescription="carrusel"
      aria-label="Colecciones destacadas"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className="hero__img"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
        />
      </AnimatePresence>
      <div className="hero__shade" aria-hidden="true" />

      <div className="hero__copy">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
          >
            <p className="eyebrow">{slide.kicker}</p>
            <h1>{slide.title}</h1>
            <p className="hero__text">{slide.text}</p>
          </motion.div>
        </AnimatePresence>
        <CurtainLink to="/catalogo" className="btn btn--solid">
          Compra ahora
        </CurtainLink>
      </div>

      <div className="hero__dots" role="tablist" aria-label="Diapositivas">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Mostrar ${s.title}`}
            className={`hero__dot${i === index ? ' is-active' : ''}`}
            onClick={() => setIndex(i)}
          >
            <span className="hero__dot-fill" />
          </button>
        ))}
      </div>
    </section>
  );
}
