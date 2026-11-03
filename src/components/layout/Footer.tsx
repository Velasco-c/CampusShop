import { SITE } from '../../content/site';

export function Footer() {
  return (
    <footer className="site-footer">
      <nav className="social-links" aria-label="Redes sociales">
        {SITE.socials.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
            {s.label}
          </a>
        ))}
      </nav>
      <p className="footer-legal">{SITE.credit}</p>
    </footer>
  );
}
