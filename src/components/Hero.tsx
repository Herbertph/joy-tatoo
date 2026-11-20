import { hero } from '../data/tattooData';
import { btnOutline, btnPrimary, Eyebrow } from './ui';

export function Hero() {
  return (
    <section id="home" aria-labelledby="home-heading" className="px-5 py-14 md:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[55fr_45fr]">
        <div>
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <h1 id="home-heading" className="mt-4 font-heading text-5xl font-bold leading-[1.05] md:text-6xl xl:text-7xl">
            {hero.titleLead} <span className="block text-accent-gold">{hero.titleAccent}</span>
          </h1>
          <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight md:text-4xl">{hero.subtitle}</h2>
          <p className="mt-6 max-w-xl text-text-secondary">{hero.text}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#booking" className={btnPrimary}>
              {hero.primaryCta}
            </a>
            <a href="#portfolio" className={btnOutline}>
              {hero.secondaryCta}
            </a>
          </div>
        </div>
        <img
          src={hero.image.src}
          alt={hero.image.alt}
          width={900}
          height={1000}
          className="aspect-[9/10] w-full rounded-md border border-border-subtle object-cover [mask-image:linear-gradient(to_right,transparent,black_18%)]"
        />
      </div>
    </section>
  );
}
