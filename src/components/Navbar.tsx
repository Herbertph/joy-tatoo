import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { business, ctaLabel, navLinks } from '../data/tattooData';
import { btnPrimary } from './ui';

const navLink =
  'font-tag text-xs font-semibold tracking-[0.14em] text-text-primary transition-colors duration-200 ease-in-out hover:text-accent-gold';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-accent-gold bg-bg-primary/95 backdrop-blur-md">
      <nav aria-label="Main" className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-5">
        <a href="#home" aria-label="Joy Tattoo, back to top" className="flex flex-col leading-none">
          <span className="font-heading text-2xl font-bold tracking-wide">{business.logo}</span>
          <span className="mt-1 font-tag text-[0.6rem] font-medium tracking-[0.25em] text-text-secondary">
            {business.logoTagline}
          </span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} className={navLink}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a href="#booking" className={`${btnPrimary} hidden sm:inline-flex`}>
            {ctaLabel}
          </a>
          <button
            ref={buttonRef}
            type="button"
            className="rounded-md p-2 text-text-primary lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X aria-hidden="true" size={24} /> : <Menu aria-hidden="true" size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-menu"
            className="overflow-hidden border-t border-border-subtle bg-bg-secondary lg:hidden"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
          >
            <ul className="flex flex-col px-5 py-4">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={`${navLink} block py-3`} onClick={() => setOpen(false)}>
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="pt-3 sm:hidden">
                <a href="#booking" className={`${btnPrimary} w-full`} onClick={() => setOpen(false)}>
                  {ctaLabel}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
