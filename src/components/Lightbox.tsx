import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { TattooItem } from '../data/tattooData';
import { categoryLabel, wrapIndex } from '../lib/portfolio';

interface LightboxProps {
  items: TattooItem[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const iconBtn =
  'rounded-md border border-border-subtle bg-bg-secondary p-2 text-text-primary transition-colors duration-200 ease-in-out hover:border-accent-gold hover:text-accent-gold';

export function Lightbox({ items, index, onIndexChange, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null && items[index] !== undefined;
  const item = open ? items[index] : null;

  // Lock page scroll and move focus into the dialog while open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (typeof document === 'undefined') return null;

  const step = (delta: number) => {
    if (index !== null) onIndexChange(wrapIndex(index, delta, items.length));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowRight') {
      step(1);
    } else if (e.key === 'ArrowLeft') {
      step(-1);
    } else if (e.key === 'Tab') {
      // Keep focus inside the dialog.
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (!dialogRef.current?.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-bg-chrome/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          data-testid="lightbox-backdrop"
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            onKeyDown={onKeyDown}
            className="relative flex max-h-full w-full max-w-3xl flex-col overflow-auto rounded-md border border-border-subtle bg-bg-secondary"
          >
            <div className="flex items-center justify-end gap-2 p-3">
              <button type="button" className={iconBtn} aria-label="Previous piece" onClick={() => step(-1)}>
                <ChevronLeft aria-hidden="true" size={20} />
              </button>
              <button type="button" className={iconBtn} aria-label="Next piece" onClick={() => step(1)}>
                <ChevronRight aria-hidden="true" size={20} />
              </button>
              <button ref={closeRef} type="button" className={iconBtn} aria-label="Close" onClick={onClose}>
                <X aria-hidden="true" size={20} />
              </button>
            </div>
            <img src={item.imageUrl} alt={item.alt} className="max-h-[65vh] w-full object-contain" />
            <div className="p-5">
              <h3 id="lightbox-title" className="font-heading text-2xl font-semibold">
                {item.title}
              </h3>
              <p className="mt-1 font-tag text-xs font-semibold uppercase tracking-wider text-accent-gold">
                {categoryLabel(item.category)}
              </p>
              <p className="mt-2 text-sm text-text-secondary">Session time: {item.sessionTime}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
