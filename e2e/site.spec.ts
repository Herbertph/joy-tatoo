import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

const isDesktop = (name: string) => name === 'desktop';

/** Waits until the element's top sits just below the sticky navbar (not covered, in view). */
async function expectInViewBelowNavbar(page: Page, target: Locator) {
  await expect
    .poll(async () => {
      const header = await page.locator('header').boundingBox();
      const box = await target.boundingBox();
      if (!header || !box) return false;
      const vh = page.viewportSize()!.height;
      return box.y >= header.y + header.height - 1 && box.y < vh;
    })
    .toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('AC-1: top bar, navbar, hero and trust bar appear in order with one h1', async ({ page }, info) => {
  test.skip(!isDesktop(info.project.name), 'desktop layout');
  const order = [
    page.getByRole('link', { name: '700 Main St Unit 303, Moncton, NB E1C 1E7' }),
    page.getByRole('navigation', { name: 'Main' }),
    page.getByRole('heading', { level: 1, name: 'ART THAT STAYS. STORIES IN INK.' }),
    page.getByRole('heading', { name: 'Why Choose Joy Tattoo' }),
  ];
  let lastY = -1;
  for (const loc of order) {
    await expect(loc).toBeVisible();
    const y = (await loc.boundingBox())!.y;
    expect(y).toBeGreaterThan(lastY);
    lastY = y;
  }
  await expect(page.getByText('Downtown Moncton • Custom Ink & Walk-Ins')).toBeVisible();
  await expect(page.getByText('Moncton’s Boutique Tattoo Studio.')).toBeVisible();
  await expect(page.getByText('5-Star Rated Studio')).toBeVisible();
  await expect(page.locator('h1')).toHaveCount(1);
});

test('AC-2: top bar address opens Google Maps in a new tab', async ({ page }, info) => {
  test.skip(!isDesktop(info.project.name), 'desktop link');
  const link = page.getByRole('link', { name: '700 Main St Unit 303, Moncton, NB E1C 1E7' });
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', /noopener/);
  const href = new URL((await link.getAttribute('href'))!);
  expect(href.hostname).toBe('www.google.com');
  expect(href.searchParams.get('query')).toBe('700 Main St Unit 303, Moncton, NB E1C 1E7');
});

for (const [label, id] of [
  ['HOME', 'home'],
  ['PORTFOLIO', 'portfolio'],
  ['ARTISTS', 'artists'],
  ['AFTERCARE', 'aftercare'],
  ['FAQ', 'faq'],
] as const) {
  test(`AC-3: ${label} scrolls to #${id} without hiding its heading`, async ({ page }, info) => {
    test.skip(!isDesktop(info.project.name), 'desktop nav');
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: label, exact: true }).click();
    await expectInViewBelowNavbar(page, page.locator(`#${id} :is(h1, h2)`).first());
  });
}

test('AC-4: navbar stays visible after scrolling to the footer', async ({ page }) => {
  await page.locator('footer').scrollIntoViewIfNeeded();
  await expect.poll(async () => (await page.locator('header').boundingBox())?.y).toBe(0);
  await expect(page.locator('header')).toBeInViewport();
});

test('AC-5: booking CTAs scroll to the form', async ({ page }, info) => {
  test.skip(!isDesktop(info.project.name), 'desktop CTAs');
  const heading = page.getByRole('heading', { name: 'Book a Consultation or Request a Quote' });
  const triggers = [
    page.locator('header').getByRole('link', { name: 'BOOK A CONSULTATION' }),
    page.locator('#home').getByRole('link', { name: 'BOOK A CONSULTATION' }),
    page.getByRole('link', { name: 'Downtown Moncton • Custom Ink & Walk-Ins' }),
  ];
  for (const t of triggers) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await t.click();
    await expectInViewBelowNavbar(page, heading);
  }
});

test('AC-6: phone layout shows the short top bar, a menu button and no horizontal scroll', async ({ page }, info) => {
  test.skip(isDesktop(info.project.name), 'mobile layout');
  await expect(page.getByText('700 Main St Unit 303, Moncton • Book Online')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'PORTFOLIO' })).toBeHidden();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('AC-7: mobile menu link closes the menu and scrolls; Escape returns focus', async ({ page }, info) => {
  test.skip(isDesktop(info.project.name), 'mobile menu');
  const button = page.getByRole('button', { name: 'Open menu' });
  await button.click();
  await page.locator('#mobile-menu').getByRole('link', { name: 'FAQ' }).click();
  await expect(page.locator('#mobile-menu')).toHaveCount(0);
  await expectInViewBelowNavbar(page, page.getByRole('heading', { name: 'Frequently Asked Questions' }));

  await button.click();
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-menu')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
});

test('AC-11: card info is hidden until hover or focus on desktop', async ({ page }, info) => {
  test.skip(!isDesktop(info.project.name), 'hover device');
  const card = page.locator('#portfolio li').first();
  const overlay = card.getByTestId('card-info');
  await expect(overlay).toHaveCSS('opacity', '0');
  await card.hover();
  await expect(overlay).toHaveCSS('opacity', '1');
  await page.mouse.move(0, 0);
  await expect(overlay).toHaveCSS('opacity', '0');
  await card.getByRole('button', { name: 'Request Similar Style' }).focus();
  await expect(overlay).toHaveCSS('opacity', '1');
});

test('AC-11: card info is always visible on touch screens', async ({ page }, info) => {
  test.skip(isDesktop(info.project.name), 'touch device');
  await expect(page.getByTestId('card-info').first()).toHaveCSS('opacity', '1');
});

for (const [filter, style] of [
  ['Fine Line', 'Fine Line'],
  ['Black & Grey', 'Black & Grey'],
  ['Botanical & Floral', 'Botanical / Floral'],
  ['Traditional & Bold', 'Traditional / Bold'],
  ['Cover-Ups', 'Cover-Up'],
] as const) {
  test(`AC-12: "${filter}" card preselects "${style}"`, async ({ page }) => {
    await page.getByRole('button', { name: filter, exact: true }).click();
    const card = page.locator('#portfolio li').first();
    await card.hover();
    await card.getByRole('button', { name: 'Request Similar Style' }).click();
    await expect(page.getByLabel('Tattoo Style *')).toHaveValue(style);
    await expectInViewBelowNavbar(page, page.getByRole('heading', { name: 'Book a Consultation or Request a Quote' }));
  });
}

test('AC-13/AC-14: lightbox opens on a card and returns focus on close', async ({ page }) => {
  const opener = page.getByRole('button', { name: 'Open Fern Half-Sleeve' });
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'Fern Half-Sleeve' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('Session time: 5 Hours')).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('AC-17: pricing cards, badge and deposit notice', async ({ page }) => {
  const pricing = page.locator('#pricing');
  for (const t of ['Minimum & Small Pieces', 'Custom Medium Piece', 'Half-Day & Full-Day Sessions']) {
    await expect(pricing.getByRole('heading', { name: t })).toBeVisible();
  }
  for (const p of ['Starting at $120 CAD', '$200 – $450 CAD', '$550 – $950 CAD', 'MOST REQUESTED']) {
    await expect(pricing.getByText(p, { exact: true })).toBeVisible();
  }
  await expect(pricing.getByText(/^Deposit Policy Notice:/)).toBeVisible();
});

for (const [button, size] of [
  ['Inquire Small Piece', 'Small (2–4")'],
  ['Start Custom Project', 'Medium (4–6")'],
  ['Book Full Session', 'Large (6"+ / Sleeve)'],
] as const) {
  test(`AC-18: "${button}" preselects ${size}`, async ({ page }) => {
    await page.getByRole('button', { name: button }).click();
    await expect(page.getByLabel('Approximate Size *')).toHaveValue(size);
    await expectInViewBelowNavbar(page, page.getByRole('heading', { name: 'Book a Consultation or Request a Quote' }));
  });
}

test('AC-32: valid form posts one multipart request and shows the success message', async ({ page }) => {
  let calls = 0;
  let contentType = '';
  await page.route('https://inquiry.test/submit', async (route) => {
    calls++;
    contentType = route.request().headers()['content-type'] ?? '';
    await new Promise((r) => setTimeout(r, 300));
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  await page.getByLabel('Full Name *').fill('Camille Roy');
  await page.getByLabel('Email Address *').fill('joy@example.com');
  await page.getByLabel('Tattoo Style *').selectOption('Fine Line');
  await page.getByLabel('Body Placement *').fill('Ankle');
  await page.getByLabel('Approximate Size *').selectOption('Small (2–4")');
  await page.getByLabel('Idea Description & Preferred Days *').fill('A tiny moon, Saturdays.');
  await page.getByLabel(/I confirm I am 18/).check();
  await page.getByLabel(/Reference Images/).setInputFiles({ name: 'ref.png', mimeType: 'image/png', buffer: Buffer.from('x') });
  await page.getByRole('button', { name: 'SUBMIT TATTOO INQUIRY' }).click();
  await expect(page.getByRole('button', { name: 'SENDING…' })).toBeDisabled();
  const success = page.getByText(/^Thank you for your inquiry!/);
  await expect(success).toBeFocused();
  expect(calls).toBe(1);
  expect(contentType).toContain('multipart/form-data');
});

test('AC-36: footer columns, external links and current year', async ({ page }) => {
  const footer = page.locator('footer');
  for (const h of ['Quick Links', 'Serving Greater Moncton', 'Studio Location & Hours']) {
    await expect(footer.getByRole('heading', { name: h })).toBeVisible();
  }
  for (const name of ['Instagram', 'Facebook', 'Google Maps']) {
    await expect(footer.getByRole('link', { name })).toHaveAttribute('target', '_blank');
  }
  await expect(footer.getByText('Tuesday – Saturday: 11:00 AM – 7:00 PM')).toBeVisible();
  await expect(footer.getByText(`© ${new Date().getFullYear()} Joy Tattoo. All rights reserved.`)).toBeVisible();
  await footer.getByRole('link', { name: 'Pricing & Session Guide' }).click();
  await expectInViewBelowNavbar(page, page.getByRole('heading', { name: 'Transparent Rates & Custom Quotes' }));
});

test('AC-37: built index.html has SEO tags and TattooParlor JSON-LD', async ({ page }) => {
  const html = readFileSync('dist/index.html', 'utf8');
  expect(html).toContain('<html lang="en">');
  await expect(page).toHaveTitle('Joy Tattoo | Custom Tattoo Studio in Downtown Moncton, NB');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /fine-line.*700 Main St, Moncton/);
  for (const p of ['og:title', 'og:description', 'og:image', 'og:type']) {
    await expect(page.locator(`meta[property="${p}"]`)).toHaveCount(1);
  }
  const scripts = page.locator('script[type="application/ld+json"]');
  await expect(scripts).toHaveCount(1);
  const data = JSON.parse((await scripts.textContent())!);
  expect(data['@type']).toBe('TattooParlor');
  expect(data.address.streetAddress).toBe('700 Main St Unit 303');
  expect(data.openingHoursSpecification.opens).toBe('11:00');
  expect(data.areaServed).toEqual(['Moncton', 'Dieppe', 'Riverview', 'Shediac', 'Sackville']);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('AC-38: nav and lightbox happen without animation', async ({ page }) => {
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
    await page.getByRole('button', { name: 'Open Fern Half-Sleeve' }).click();
    const backdrop = page.getByTestId('lightbox-backdrop');
    expect(await backdrop.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  });
});

test('AC-39: no serious or critical axe violations', async ({ page }) => {
  // Reveal every section so fade-ins have finished before scanning.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  const results = await new AxeBuilder({ page }).analyze();
  const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
});
