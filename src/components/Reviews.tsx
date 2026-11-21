import { Quote } from 'lucide-react';
import { reviews, reviewsSection, trustBar } from '../data/tattooData';
import { Section, Stars } from './ui';

export function Reviews() {
  return (
    <Section id="reviews" eyebrow={reviewsSection.eyebrow} heading={reviewsSection.heading} className="bg-bg-band">
      <ul className="grid gap-6 md:grid-cols-3">
        {reviews.map((r) => (
          <li key={r.name} className="flex flex-col rounded-md border border-border-subtle bg-bg-secondary p-6">
            <figure className="flex flex-1 flex-col">
              <Quote aria-hidden="true" size={24} className="text-accent-gold" />
              <blockquote className="mt-3 flex-1 text-text-primary">“{r.quote}”</blockquote>
              <figcaption className="mt-5">
                <Stars label={trustBar.ratingLabel} />
                <p className="mt-2 font-semibold">{r.name}</p>
                <p className="text-sm text-text-secondary">{r.city}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
