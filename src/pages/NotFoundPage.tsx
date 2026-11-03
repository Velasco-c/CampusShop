import { EmptyState } from '../components/ui/States';
import { CurtainLink, FadeIn } from '../engine/transitions';

export default function NotFoundPage() {
  return (
    <section className="container page">
      <FadeIn>
        <EmptyState
          title="Página no encontrada"
          text="La prenda o la sección que buscas no existe."
          action={
            <CurtainLink to="/" className="btn btn--solid">
              Volver al inicio
            </CurtainLink>
          }
        />
      </FadeIn>
    </section>
  );
}
