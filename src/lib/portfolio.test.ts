import { portfolioCategories, portfolioItems, tattooStyles, type TattooItem } from '../data/tattooData';
import { categoryLabel, filterByCategory, formStyleFor, wrapIndex } from './portfolio';

describe('portfolio data', () => {
  it('has 8 items and at least one per category', () => {
    expect(portfolioItems).toHaveLength(8);
    for (const c of portfolioCategories) {
      expect(portfolioItems.some((i) => i.category === c.id)).toBe(true);
    }
  });

  it('maps every category to an existing form tattoo style', () => {
    for (const c of portfolioCategories) expect(tattooStyles).toContain(formStyleFor(c.id));
  });
});

describe('filterByCategory', () => {
  it('returns all items for "all"', () => {
    expect(filterByCategory(portfolioItems, 'all')).toHaveLength(8);
  });

  it('returns only items of the chosen category', () => {
    const fine = filterByCategory(portfolioItems, 'fine-line');
    expect(fine.length).toBeGreaterThan(0);
    expect(fine.every((i) => i.category === 'fine-line')).toBe(true);
  });

  it('returns an empty list when a category has no items', () => {
    const items: TattooItem[] = portfolioItems.filter((i) => i.category !== 'cover-up');
    expect(filterByCategory(items, 'cover-up')).toEqual([]);
  });
});

describe('wrapIndex', () => {
  it('moves forward and wraps from last to first', () => {
    expect(wrapIndex(0, 1, 3)).toBe(1);
    expect(wrapIndex(2, 1, 3)).toBe(0);
  });

  it('moves back and wraps from first to last', () => {
    expect(wrapIndex(0, -1, 3)).toBe(2);
  });
});

describe('formStyleFor / categoryLabel', () => {
  it.each([
    ['fine-line', 'Fine Line', 'Fine Line'],
    ['black-grey', 'Black & Grey', 'Black & Grey'],
    ['botanical', 'Botanical / Floral', 'Botanical & Floral'],
    ['traditional', 'Traditional / Bold', 'Traditional & Bold'],
    ['cover-up', 'Cover-Up', 'Cover-Ups'],
  ] as const)('%s maps to form "%s" and label "%s"', (cat, style, label) => {
    expect(formStyleFor(cat)).toBe(style);
    expect(categoryLabel(cat)).toBe(label);
  });
});
