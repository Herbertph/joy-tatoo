import { portfolioCategories, type PortfolioCategory, type TattooItem } from '../data/tattooData';

export type PortfolioFilter = PortfolioCategory | 'all';

export function filterByCategory(items: TattooItem[], filter: PortfolioFilter): TattooItem[] {
  return filter === 'all' ? items : items.filter((item) => item.category === filter);
}

/** Moves `step` positions from `index` in a list of `length`, wrapping at both ends. */
export function wrapIndex(index: number, step: number, length: number): number {
  if (length <= 0) return 0;
  return (((index + step) % length) + length) % length;
}

export function formStyleFor(category: PortfolioCategory): string {
  return portfolioCategories.find((c) => c.id === category)?.formStyle ?? '';
}

export function categoryLabel(category: PortfolioCategory): string {
  return portfolioCategories.find((c) => c.id === category)?.label ?? '';
}
