import type { PointerEvent } from 'react';
import { motion } from 'motion/react';
import type { Product } from '../../domain/types';
import { categoryLabel } from '../../content/site';
import { formatMoney } from '../../utils/format';
import { CurtainLink, enterProps } from '../../engine/transitions';
import { Icon } from '../ui/Icon';

interface ProductCardProps {
  product: Product;
  /** Posición en la rejilla: controla el retraso de la entrada. */
  index?: number;
}

// Luz que sigue al cursor. Solo actualiza dos variables CSS, sin re-renderizar React.
function spotlight(event: PointerEvent<HTMLAnchorElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`);
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const onSale = product.listPrice > product.price;
  const to = `/producto/${product.id}`;

  return (
    <motion.article className="product-card" {...enterProps(index)}>
      <CurtainLink to={to} className="product-card__media" aria-label={`Ver ${product.title}`} onPointerMove={spotlight}>
        <img src={product.thumbnail} alt="" loading="lazy" />
        {onSale && <span className="tag">−{Math.round(product.discountPercentage)}%</span>}
        <span className="product-card__cta" aria-hidden="true">
          <Icon name="arrow-right" />
        </span>
      </CurtainLink>
      <div className="product-card__body">
        <p className="eyebrow">
          {product.brand} · {categoryLabel(product.category)}
        </p>
        <h3>
          <CurtainLink to={to}>{product.title}</CurtainLink>
        </h3>
        <p className="price">
          {formatMoney(product.price)}
          {onSale && <s>{formatMoney(product.listPrice)}</s>}
        </p>
      </div>
    </motion.article>
  );
}
