import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { scrollToSection } from './ui';

export type PresetField = 'tattooStyle' | 'approxSize';
export interface Preset {
  field: PresetField;
  value: string;
  /** Changes on every request so picking the same value twice still applies it. */
  key: number;
}

interface BookingContextValue {
  preset: Preset | null;
  requestBooking: (field: PresetField, value: string) => void;
}

const BookingContext = createContext<BookingContextValue>({ preset: null, requestBooking: () => {} });

export function BookingProvider({ children }: { children: ReactNode }) {
  const [preset, setPreset] = useState<Preset | null>(null);
  const requestBooking = useCallback((field: PresetField, value: string) => {
    setPreset({ field, value, key: Date.now() });
    scrollToSection('booking');
  }, []);
  const value = useMemo(() => ({ preset, requestBooking }), [preset, requestBooking]);
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  return useContext(BookingContext);
}
