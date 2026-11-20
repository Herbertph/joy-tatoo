import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { faqs, faqSection } from '../data/tattooData';
import { Section } from './ui';

export function Faq() {
  const [open, setOpen] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <Section id="faq" eyebrow={faqSection.eyebrow} heading={faqSection.heading}>
      <ul className="mx-auto max-w-3xl divide-y divide-border-subtle border-y border-border-subtle">
        {faqs.map((f, i) => {
          const isOpen = open.has(i);
          return (
            <li key={f.question}>
              <h3>
                <button
                  type="button"
                  id={`faq-q-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left font-heading text-xl font-semibold transition-colors duration-200 ease-in-out hover:text-accent-gold"
                >
                  {f.question}
                  <ChevronDown
                    aria-hidden="true"
                    size={20}
                    className={`shrink-0 text-accent-gold transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              </h3>
              <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} hidden={!isOpen}>
                {isOpen && (
                  <motion.p
                    className="pb-5 text-text-secondary"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {f.answer}
                  </motion.p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
