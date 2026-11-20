import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { careGuide } from '../data/tattooData';
import { wrapIndex } from '../lib/portfolio';
import { Section } from './ui';

export function CareGuide() {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabs = careGuide.tabs;

  const select = (i: number) => {
    setSelected(i);
    tabRefs.current[i]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') select(wrapIndex(selected, 1, tabs.length));
    else if (e.key === 'ArrowLeft') select(wrapIndex(selected, -1, tabs.length));
    else if (e.key === 'Home') select(0);
    else if (e.key === 'End') select(tabs.length - 1);
    else return;
    e.preventDefault();
  };

  const tab = tabs[selected];

  return (
    <Section id="aftercare" eyebrow={careGuide.eyebrow} heading={careGuide.heading} text={careGuide.text}>
      <div role="tablist" aria-label="Client care guide" className="mb-8 flex justify-center gap-2" onKeyDown={onKeyDown}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            id={`care-tab-${t.id}`}
            role="tab"
            type="button"
            aria-selected={i === selected}
            aria-controls={`care-panel-${t.id}`}
            tabIndex={i === selected ? 0 : -1}
            onClick={() => setSelected(i)}
            className={`border-b-2 px-4 py-3 font-tag text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ease-in-out ${
              i === selected
                ? 'border-accent-gold text-text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <motion.div
        key={tab.id}
        id={`care-panel-${tab.id}`}
        role="tabpanel"
        aria-labelledby={`care-tab-${tab.id}`}
        tabIndex={0}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <ul className="grid gap-5 md:grid-cols-2">
          {tab.items.map((item) => (
            <li key={item.title} className="rounded-md border border-border-subtle bg-bg-secondary p-6">
              <h3 className="font-heading text-2xl font-semibold text-accent-gold">{item.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{item.text}</p>
            </li>
          ))}
        </ul>
      </motion.div>
    </Section>
  );
}
