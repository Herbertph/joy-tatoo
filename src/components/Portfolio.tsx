import { useRef, useState } from 'react';
import {
  portfolioCategories,
  portfolioItems as defaultItems,
  portfolioSection,
  type TattooItem,
} from '../data/tattooData';
import { categoryLabel, filterByCategory, formStyleFor, type PortfolioFilter } from '../lib/portfolio';
import { useBooking } from './BookingContext';
import { Lightbox } from './Lightbox';
import { btnBase, Section } from './ui';

const filters: { id: PortfolioFilter; label: string }[] = [
  { id: 'all', label: portfolioSection.allLabel },
  ...portfolioCategories.map((c) => ({ id: c.id, label: c.label })),
];

export function Portfolio({ items = defaultItems }: { items?: TattooItem[] }) {
  const [filter, setFilter] = useState<PortfolioFilter>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const { requestBooking } = useBooking();
  const visible = filterByCategory(items, filter);

  return (
    <Section
      id="portfolio"
      eyebrow={portfolioSection.eyebrow}
      heading={portfolioSection.heading}
      text={portfolioSection.text}
    >
      <div role="group" aria-label="Filter by style" className="mb-10 flex flex-wrap justify-center gap-3">
        {filters.map((f) => {
          const active = f.id === filter;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.id)}
              className={`rounded-md border px-4 py-2 font-tag text-xs font-semibold tracking-wider transition-colors duration-200 ease-in-out ${
                active
                  ? 'border-accent-gold bg-accent-gold text-bg-chrome'
                  : 'border-border-subtle text-text-secondary hover:border-accent-gold hover:text-text-primary'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-text-secondary">{portfolioSection.empty}</p>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((item, index) => (
            <li
              key={item.id}
              className="group relative overflow-hidden rounded-md border border-border-subtle bg-bg-secondary"
            >
              <button
                type="button"
                className="block w-full"
                aria-label={`Open ${item.title}`}
                onClick={(e) => {
                  openerRef.current = e.currentTarget;
                  setOpenIndex(index);
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.alt}
                  width={800}
                  height={1000}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-[1.03]"
                />
              </button>
              <div
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg-chrome via-bg-chrome/90 to-transparent p-4 pt-10 opacity-0 transition-opacity duration-200 ease-in-out group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
                data-testid="card-info"
              >
                <h3 className="font-heading text-xl font-semibold leading-tight">{item.title}</h3>
                <p className="mt-1 font-tag text-[0.7rem] font-semibold uppercase tracking-wider text-accent-gold">
                  {categoryLabel(item.category)}
                </p>
                <button
                  type="button"
                  className={`${btnBase} mt-3 w-full border border-accent-gold px-3 py-2 text-text-primary hover:bg-accent-gold hover:text-bg-chrome`}
                  onClick={() => requestBooking('tattooStyle', formStyleFor(item.category))}
                >
                  {portfolioSection.cardButton}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Lightbox
        items={visible}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => {
          setOpenIndex(null);
          openerRef.current?.focus();
        }}
      />
    </Section>
  );
}
