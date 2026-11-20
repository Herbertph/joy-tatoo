import { business, footer } from '../data/tattooData';
import { mapsUrl } from '../lib/mapsUrl';

const heading = 'font-tag text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold';
const link = 'text-sm text-text-secondary transition-colors duration-200 ease-in-out hover:text-text-primary';

export function Footer() {
  const external = [
    { label: 'Instagram', href: business.instagramUrl },
    { label: 'Facebook', href: business.facebookUrl },
    { label: 'Google Maps', href: mapsUrl(business.address) },
  ];
  return (
    <footer className="border-t border-border-subtle bg-bg-chrome px-5 pt-16 text-sm">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-heading text-2xl font-bold tracking-wide">{business.logo}</p>
          <p className="mt-3 text-text-secondary">{footer.tagline}</p>
          <ul className="mt-4 flex gap-4">
            {external.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className={link}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <nav aria-labelledby="footer-quick-links">
          <h2 id="footer-quick-links" className={heading}>
            {footer.quickLinksHeading}
          </h2>
          <ul className="mt-4 space-y-2">
            {footer.quickLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={link}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className={heading}>{footer.areasHeading}</h2>
          <ul className="mt-4 space-y-2 text-text-secondary">
            {footer.areas.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className={heading}>{footer.locationHeading}</h2>
          <address className="mt-4 space-y-2 not-italic text-text-secondary">
            <p>{business.address}</p>
            <p>{footer.schedule}</p>
            {footer.hours.map((h) => (
              <p key={h}>{h}</p>
            ))}
          </address>
        </div>
      </div>
      <p className="mx-auto mt-14 max-w-6xl border-t border-border-subtle py-6 text-center text-xs text-text-secondary">
        © {new Date().getFullYear()} {footer.copyrightSuffix}
      </p>
    </footer>
  );
}
