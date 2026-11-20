import { PenTool, ShieldCheck } from 'lucide-react';
import { trustBar } from '../data/tattooData';
import { Stars } from './ui';

export function TrustBar() {
  return (
    <section aria-labelledby="trust-heading" className="border-y border-accent-gold/60 bg-bg-band px-5 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-center items-center gap-6">
          <span aria-hidden="true" className="hidden h-px flex-1 bg-accent-gold/50 sm:block" />
          <h2 id="trust-heading" className="text-center font-heading text-3xl font-semibold text-accent-gold md:text-4xl">
            {trustBar.heading}
          </h2>
          <span aria-hidden="true" className="hidden h-px flex-1 bg-accent-gold/50 sm:block" />
        </div>
        <ul className="mt-10 grid gap-10 text-center md:grid-cols-3 md:gap-0 md:divide-x md:divide-border-subtle">
          {trustBar.items.map((item) => (
            <li key={item.title} className="flex flex-col items-center px-6">
              {item.icon === 'stars' ? (
                <Stars label={trustBar.ratingLabel} size={20} />
              ) : item.icon === 'pen' ? (
                <PenTool aria-hidden="true" size={24} className="text-accent-gold" />
              ) : (
                <ShieldCheck aria-hidden="true" size={24} className="text-accent-gold" />
              )}
              <h3 className="mt-4 font-heading text-2xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
