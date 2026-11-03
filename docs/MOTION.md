# Movimiento en CampusShop

Cada animación tiene una razón. Si una no cumple su función, se elimina.
Todas se desactivan con `prefers-reduced-motion` (`MotionConfig reducedMotion="user"`
en `App.tsx` y reglas CSS para el carrusel).

| Animación | Dónde | Por qué existe | Duración | Implementación |
|---|---|---|---|---|
| Cortina entre páginas | Cualquier enlace interno (`CurtainLink`) | Es la única transición entre páginas. Confirma el cambio de ruta y oculta el montaje de la nueva vista. | 0.32 s cubrir + 0.36 s revelar | `motion` (`animate` sobre `transform`) |
| Entrada de página | Contenedor `main` | Evita que el contenido aparezca de golpe al revelarse la cortina. | 0.32 s | Variantes `pageVariants` |
| Entrada escalonada de tarjetas | Rejillas de producto | Orienta la lectura. El retraso se limita a 8 posiciones × 45 ms para no retrasar la lista completa. | 0.45 s + retraso | `enterProps(index)` |
| Coverflow por categoría | Catálogo "Todo" y producto relacionado | Muestra una categoría por sección y deja el producto activo al centro. Solo se usa con 3 o más productos. | 0.5 s | `CoverflowRow` (rotateY, x, scale) |
| Línea de pestaña | Categorías del catálogo y tallas | Indica la opción activa; la línea se desliza entre opciones en vez de cambiar de color de golpe. | Resorte | `layoutId` en `TabBar` |
| Luz en la tarjeta | Imagen de producto | Responde al cursor sin re-renderizar React (solo cambia dos variables CSS). | Continuo | `--mx` / `--my` |
| Zoom de imagen | Tarjetas y lookbook | Confirma que el elemento es interactivo. | 0.6 s | CSS `transform` |
| Carrusel de inicio | Hero | Muestra las colecciones sin requerir clic. La barra de progreso indica cuánto falta para la siguiente. Se pausa al pasar el cursor. | 6 s por diapositiva | Temporizador + CSS `dot-fill` |
| Confirmación al añadir | Botón "Añadir al carrito" | Confirma la acción: el texto cambia y el check se dibuja. Dura 1.6 s. | 0.45 s | `Icon drawIn` |
| Contador del carrito | Icono de bolsa | Muestra que la cantidad cambió. | 0.22 s | `AnimatePresence` |
| Total que cuenta | Resumen del carrito | Muestra que el total cambió sin saltos bruscos. | 0.45 s | `AnimatedNumber` (MotionValue) |
| Barra de envío gratis | Resumen del carrito | Muestra el avance hacia el envío gratis. | 0.5 s | `scaleX` |
| Línea de estado del pedido | Pedido | Muestra en qué etapa va el pedido. | 0.7 s | `scaleX` |
| Menú lateral | Botón de menú | Desliza el panel y escalona los enlaces. | 0.28 s + 30 ms por enlace | `motion.aside` |

## Qué se eliminó y por qué

- **Sesgo y rotación en el menú**: competían con el contenido.
- **Anillo de impacto en el carrito**: duplicaba la función del contador.
- **Entrada escalonada en todos los bloques**: ahora solo las tarjetas usan escalonado.
- **Coverflow con productos repetidos**: rellenaba posiciones con duplicados. Ahora solo muestra productos reales.

## Librerías consideradas

- **Motion UI (Coverflow, Gallery, Curtains)**: el coverflow y `useCurtains` son de Motion+ (de pago). Se implementaron con el paquete gratuito `motion`.
- **Magic UI**: open source (React, Motion y Tailwind). Se tomaron los patrones (entrada con desenfoque, contador, luz de cursor). Como el proyecto usa CSS sin Tailwind, el código es propio.
- **Animata**: se declara MIT. Se tomaron los patrones de pestañas y tarjetas. Antes de copiar código literal, revisa la licencia de cada componente.
- **react-spring**: no se añadió. Duplica los springs que ya ofrece `motion` y agrega unos 55 kB. Si quieres usarlo, conviene aislarlo a un solo caso.
