import { MapPin, Sparkles } from 'lucide-react';
import { business, topBar } from '../data/tattooData';
import { mapsUrl } from '../lib/mapsUrl';

const link = 'transition-colors duration-200 ease-in-out hover:text-text-primary';

export function TopBar() {
  const maps = mapsUrl(business.address);
  return (
    <div className="bg-bg-chrome text-xs text-text-secondary">
      <div className="mx-auto hidden h-9 max-w-6xl items-center justify-between px-5 md:flex">
        <a href={maps} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 ${link}`}>
          <MapPin aria-hidden="true" size={14} className="text-accent-gold" />
          {business.address}
        </a>
        <a href="#booking" className={`flex items-center gap-2 ${link}`}>
          <Sparkles aria-hidden="true" size={14} className="text-accent-gold" />
          {topBar.right}
        </a>
      </div>
      <p className="flex h-9 items-center justify-center px-3 text-center md:hidden">
        <a href={maps} target="_blank" rel="noopener noreferrer" className={link}>
          {business.shortAddress}
        </a>
        <span aria-hidden="true" className="whitespace-pre">{' • '}</span>
        <a href="#booking" className={`text-accent-gold ${link}`}>
          {topBar.mobileBook}
        </a>
      </p>
    </div>
  );
}
