import { motion, useReducedMotion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { ReactNode } from 'react';

export const btnBase =
  'inline-flex items-center justify-center rounded-md px-5 py-3 font-tag text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ease-in-out';
export const btnPrimary = `${btnBase} bg-accent-gold text-bg-chrome hover:bg-accent-gold-light`;
export const btnOutline = `${btnBase} border border-accent-gold text-text-primary hover:bg-accent-gold hover:text-bg-chrome`;

/** Scrolls to a section, instantly when the user prefers reduced motion. */
export function scrollToSection(id: string) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-tag text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">{children}</p>;
}

export function Stars({ label, size = 16 }: { label: string; size?: number }) {
  return (
    <span role="img" aria-label={label} className="inline-flex gap-0.5 text-rating-star">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} aria-hidden="true" width={size} height={size} fill="currentColor" strokeWidth={0} />
      ))}
    </span>
  );
}

interface SectionProps {
  id: string;
  eyebrow: string;
  heading: string;
  text?: string;
  className?: string;
  children: ReactNode;
}

/** A page section with the shared eyebrow / heading / intro layout and a gentle fade-in. */
export function Section({ id, eyebrow, heading, text, className = '', children }: SectionProps) {
  const reduce = useReducedMotion();
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={`px-5 py-20 md:py-24 ${className}`}>
      <motion.div
        className="mx-auto max-w-6xl"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
      >
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id={`${id}-heading`} className="mt-3 font-heading text-4xl font-semibold leading-tight md:text-5xl">
            {heading}
          </h2>
          {text && <p className="mt-4 text-text-secondary">{text}</p>}
        </div>
        {children}
      </motion.div>
    </section>
  );
}
