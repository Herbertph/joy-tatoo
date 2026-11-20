import { Info } from 'lucide-react';
import { pricingCards, pricingSection } from '../data/tattooData';
import { useBooking } from './BookingContext';
import { btnOutline, btnPrimary, Section } from './ui';

export function Pricing() {
  const { requestBooking } = useBooking();
  return (
    <Section id="pricing" eyebrow={pricingSection.eyebrow} heading={pricingSection.heading} text={pricingSection.text}>
      <ul className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
        {pricingCards.map((card) => (
          <li
            key={card.title}
            className={`relative flex flex-col rounded-md border bg-bg-secondary p-8 ${
              card.featured ? 'border-accent-gold shadow-glow' : 'border-border-subtle'
            }`}
          >
            {card.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-md bg-accent-gold px-3 py-1 font-tag text-[0.65rem] font-semibold tracking-[0.15em] text-bg-chrome">
                {pricingSection.badge}
              </span>
            )}
            <h3 className="font-heading text-2xl font-semibold">{card.title}</h3>
            <p className="mt-3 font-heading text-3xl font-bold text-accent-gold">{card.price}</p>
            <p className="mt-4 flex-1 text-sm text-text-secondary">{card.details}</p>
            <button
              type="button"
              className={`${card.featured ? btnPrimary : btnOutline} mt-8 w-full`}
              onClick={() => requestBooking('approxSize', card.size)}
            >
              {card.button}
            </button>
          </li>
        ))}
      </ul>
      <p className="mx-auto mt-10 flex max-w-3xl items-start gap-3 rounded-md border border-border-subtle p-4 text-sm text-text-secondary">
        <Info aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-accent-gold" />
        <span>{pricingSection.notice}</span>
      </p>
    </Section>
  );
}
