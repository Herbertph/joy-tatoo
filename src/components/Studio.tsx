import { motion, useReducedMotion } from 'framer-motion';
import { studioSection } from '../data/tattooData';
import { Eyebrow } from './ui';

export function Studio() {
  const reduce = useReducedMotion();
  return (
    <section id="artists" aria-labelledby="artists-heading" className="bg-bg-band px-5 py-20 md:py-24">
      <motion.div
        className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
      >
        <img
          src={studioSection.image.src}
          alt={studioSection.image.alt}
          width={900}
          height={700}
          loading="lazy"
          className="w-full rounded-md border border-border-subtle object-cover"
        />
        <div>
          <Eyebrow>{studioSection.eyebrow}</Eyebrow>
          <h2 id="artists-heading" className="mt-3 font-heading text-4xl font-semibold leading-tight md:text-5xl">
            {studioSection.heading}
          </h2>
          {studioSection.paragraphs.map((p) => (
            <p key={p.slice(0, 20)} className="mt-5 text-text-secondary">
              {p}
            </p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
