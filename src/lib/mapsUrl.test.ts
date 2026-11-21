import { mapsUrl } from './mapsUrl';

describe('mapsUrl', () => {
  it('builds a Google Maps search URL with the encoded address', () => {
    const url = new URL(mapsUrl('700 Main St Unit 303, Moncton, NB E1C 1E7'));
    expect(url.origin).toBe('https://www.google.com');
    expect(url.pathname).toBe('/maps/search/');
    expect(url.searchParams.get('query')).toBe('700 Main St Unit 303, Moncton, NB E1C 1E7');
  });
});
