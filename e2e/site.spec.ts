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

/** Fills the booking form with valid required values. */
async function fillValidForm(page: Page, fullName = 'Camille Roy') {
  await page.getByLabel('Full Name *').fill(fullName);
  await page.getByLabel('Email Address *').fill('joy@example.com');
  await page.getByLabel('Tattoo Style *').selectOption('Fine Line');
  await page.getByLabel('Body Placement *').fill('Ankle');
  await page.getByLabel('Approximate Size *').selectOption('Small (2–4")');
  await page.getByLabel('Idea Description & Preferred Days *').fill('A tiny moon, Saturdays.');
  await page.getByLabel(/I confirm I am 18/).check();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('TC-1 (AC-1): top bar, navbar, hero and trust bar appear in order with one h1', async ({ page }, info) => {
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

test('TC-2 (AC-2): top bar address opens Google Maps in a new tab', async ({ page }, info) => {
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
  test(`TC-3 (AC-3): ${label} scrolls to #${id} without hiding its heading`, async ({ page }, info) => {
    test.skip(!isDesktop(info.project.name), 'desktop nav');
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: label, exact: true }).click();
    await expectInViewBelowNavbar(page, page.locator(`#${id} :is(h1, h2)`).first());
  });
}

test('TC-4 (AC-4): navbar stays visible after scrolling to the footer', async ({ page }) => {
  await page.locator('footer').scrollIntoViewIfNeeded();
  await expect.poll(async () => (await page.locator('header').boundingBox())?.y).toBe(0);
  await expect(page.locator('header')).toBeInViewport();
});

test('TC-5 (AC-5): booking CTAs scroll to the form', async ({ page }, info) => {
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

test('TC-6 (AC-6): phone layout shows the short top bar, a menu button and no horizontal scroll', async ({ page }, info) => {
  test.skip(isDesktop(info.project.name), 'mobile layout');
  await expect(page.getByText('700 Main St Unit 303, Moncton • Book Online')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'PORTFOLIO' })).toBeHidden();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('TC-7 (AC-7): mobile menu link closes the menu and scrolls; Escape returns focus', async ({ page }, info) => {
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

test('TC-11 (AC-11): card info is hidden until hover or focus on desktop', async ({ page }, info) => {
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

test('TC-11 (AC-11): card info is always visible on touch screens', async ({ page }, info) => {
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
  test(`TC-12 (AC-12): "${filter}" card preselects "${style}"`, async ({ page }) => {
    await page.getByRole('button', { name: filter, exact: true }).click();
    const card = page.locator('#portfolio li').first();
    await card.hover();
    await card.getByRole('button', { name: 'Request Similar Style' }).click();
    await expect(page.getByLabel('Tattoo Style *')).toHaveValue(style);
    await expectInViewBelowNavbar(page, page.getByRole('heading', { name: 'Book a Consultation or Request a Quote' }));
  });
}

test('TC-13/TC-14 (AC-13/AC-14): lightbox opens on a card and returns focus on close', async ({ page }) => {
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

test('TC-17 (AC-17): pricing cards, badge and deposit notice', async ({ page }) => {
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
  test(`TC-18 (AC-18): "${button}" preselects ${size}`, async ({ page }) => {
    await page.getByRole('button', { name: button }).click();
    await expect(page.getByLabel('Approximate Size *')).toHaveValue(size);
    await expectInViewBelowNavbar(page, page.getByRole('heading', { name: 'Book a Consultation or Request a Quote' }));
  });
}

test('TC-32 (AC-32): valid form posts one multipart request and shows the success message', async ({ page }) => {
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

test('TC-36 (AC-36): footer columns, external links and current year', async ({ page }) => {
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

test('TC-37 (AC-37): built index.html has SEO tags and TattooParlor JSON-LD', async ({ page }) => {
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

  test('TC-38 (AC-38): nav and lightbox happen without animation', async ({ page }) => {
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
    await expect(page.locator('#portfolio > div').first()).toHaveCSS('opacity', '1');
    await page.getByRole('button', { name: 'Open Fern Half-Sleeve' }).click();
    const backdrop = page.getByTestId('lightbox-backdrop');
    expect(await backdrop.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  });
});

test('TC-39 (AC-39): no serious or critical axe violations', async ({ page }) => {
  // Reveal every section so fade-ins have finished before scanning.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  const results = await new AxeBuilder({ page }).analyze();
  const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
});

test('TC-9 (AC-9): Fine Line shows only fine-line cards and sets aria-pressed', async ({ page }, info) => {
  test.skip(!isDesktop(info.project.name), 'desktop filter check');
  await page.getByRole('button', { name: 'Fine Line', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Fine Line', exact: true })).toHaveAttribute('aria-pressed', 'true');
  for (const name of ['All Work', 'Black & Grey', 'Botanical & Floral', 'Traditional & Bold', 'Cover-Ups']) {
    await expect(page.getByRole('button', { name, exact: true })).toHaveAttribute('aria-pressed', 'false');
  }
  await expect(page.locator('#portfolio li')).toHaveCount(2);
  await page.getByRole('button', { name: 'All Work', exact: true }).click();
  await expect(page.locator('#portfolio li')).toHaveCount(8);
});

test('TC-15 (AC-15): next wraps inside the active Fine Line filter', async ({ page }, info) => {
  test.skip(!isDesktop(info.project.name), 'desktop lightbox');
  await page.getByRole('button', { name: 'Fine Line', exact: true }).click();
  await page.locator('#portfolio li').last().getByRole('button', { name: /^Open / }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toHaveAccessibleName('Fine Line Script Collarbone');
  await page.getByRole('button', { name: 'Next piece' }).click();
  await expect(dialog).toHaveAccessibleName('Micro-Fine Line Botanical Forearm');
  await page.keyboard.press('ArrowLeft');
  await expect(dialog).toHaveAccessibleName('Fine Line Script Collarbone');
  await page.keyboard.press('ArrowRight');
  await expect(dialog).toHaveAccessibleName('Micro-Fine Line Botanical Forearm');
});

test('TC-16 (AC-16): Tab keeps focus inside the dialog', async ({ page }, info) => {
  test.skip(!isDesktop(info.project.name), 'desktop focus trap');
  await page.getByRole('button', { name: 'Open Fern Half-Sleeve' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.querySelector('[role="dialog"]')?.contains(document.activeElement))).toBe(true);
  }
});

test('TC-27 (AC-27): the description stops at 2000 characters and the counter follows', async ({ page }, info) => {
  test.skip(!isDesktop(info.project.name), 'desktop field check');
  const description = page.getByLabel('Idea Description & Preferred Days *');
  await description.fill('x'.repeat(2100));
  await expect(description).toHaveValue('x'.repeat(2000));
  await expect(page.locator('#projectDescription-count')).toHaveText('2000 / 2000');
});

test('TC-29 (AC-29): lists three images and rejects a fourth', async ({ page }, info) => {
  test.skip(!isDesktop(info.project.name), 'desktop file picker');
  const input = page.getByLabel(/Reference Images \(Up to 3\)/);
  await input.setInputFiles([
    { name: 'a.png', mimeType: 'image/png', buffer: Buffer.from('x') },
    { name: 'b.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('x') },
    { name: 'c.png', mimeType: 'image/png', buffer: Buffer.from('x') },
  ]);
  for (const name of ['a.png', 'b.jpg', 'c.png']) await expect(page.getByRole('button', { name: `Remove ${name}` })).toBeVisible();
  await input.setInputFiles({ name: 'd.png', mimeType: 'image/png', buffer: Buffer.from('x') });
  await expect(page.locator('#referenceImages-errors')).toContainText('d.png was not added');
  await expect(page.getByRole('button', { name: /^Remove / })).toHaveCount(3);
  await page.getByRole('button', { name: 'Remove b.jpg' }).click();
  await expect(page.getByRole('button', { name: 'Remove b.jpg' })).toHaveCount(0);
  await input.setInputFiles({ name: 'd.png', mimeType: 'image/png', buffer: Buffer.from('x') });
  await expect(page.getByRole('button', { name: 'Remove d.png' })).toBeVisible();
});

test('TC-30 (AC-30): rejects a GIF and an oversize JPG with name and reason', async ({ page }, info) => {
  test.skip(!isDesktop(info.project.name), 'desktop file picker');
  const input = page.getByLabel(/Reference Images \(Up to 3\)/);
  await input.setInputFiles([
    { name: 'anim.gif', mimeType: 'image/gif', buffer: Buffer.from('x') },
    { name: 'big.jpg', mimeType: 'image/jpeg', buffer: Buffer.alloc(6 * 1024 * 1024) },
  ]);
  await expect(page.locator('#referenceImages-errors')).toContainText('anim.gif was not added: only PNG or JPG');
  await expect(page.locator('#referenceImages-errors')).toContainText('big.jpg was not added: the file is larger than 5 MB');
  await expect(page.getByRole('button', { name: /^Remove / })).toHaveCount(0);
});

test('TC-33 (AC-33): a server error keeps every value and a retry succeeds', async ({ page }, info) => {
  test.skip(!isDesktop(info.project.name), 'desktop submit flow');
  let calls = 0;
  await page.route('https://inquiry.test/submit', async (route) => {
    calls++;
    await route.fulfill({ status: calls === 1 ? 500 : 200, contentType: 'application/json', body: '{}' });
  });
  await fillValidForm(page);
  await page.getByLabel(/Reference Images \(Up to 3\)/).setInputFiles({ name: 'ref.png', mimeType: 'image/png', buffer: Buffer.from('x') });
  await page.getByRole('button', { name: 'SUBMIT TATTOO INQUIRY' }).click();
  await expect(page.getByRole('alert')).toContainText('Sorry, we couldn’t send your inquiry.');
  await expect(page.getByLabel('Full Name *')).toHaveValue('Camille Roy');
  await expect(page.getByRole('button', { name: 'Remove ref.png' })).toBeVisible();
  await page.getByRole('button', { name: 'SUBMIT TATTOO INQUIRY' }).click();
  await expect(page.getByText(/^Thank you for your inquiry!/)).toBeFocused();
  expect(calls).toBe(2);
});

test('TC-35 (AC-35): every form control is in the keyboard tab order', async ({ page }, info) => {
  test.skip(!isDesktop(info.project.name), 'desktop keyboard journey');
  await page.getByLabel('Full Name *').focus();
  const ids = [await page.evaluate(() => document.activeElement?.id)];
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
    ids.push(await page.evaluate(() => document.activeElement?.id));
  }
  expect(ids).toEqual([
    'fullName',
    'email',
    'socialContact',
    'tattooStyle',
    'bodyPlacement',
    'approxSize',
    'budgetRange',
    'referenceImages',
    'projectDescription',
    'ageCheck',
    '', // submit button
  ]);
});

test('TC-41 (FR-14): dropping images on the drop zone adds valid files and rejects invalid ones', async ({ page }, info) => {
  test.skip(!isDesktop(info.project.name), 'desktop drop zone');
  const dataTransfer = await page.evaluateHandle(() => {
    const data = new DataTransfer();
    data.items.add(new File(['x'], 'drop.png', { type: 'image/png' }));
    data.items.add(new File(['x'], 'drop.gif', { type: 'image/gif' }));
    return data;
  });
  await page.getByTestId('drop-zone').dispatchEvent('drop', { dataTransfer });
  await expect(page.getByRole('button', { name: 'Remove drop.png' })).toBeVisible();
  await expect(page.locator('#referenceImages-errors')).toContainText('drop.gif was not added: only PNG or JPG');
});

test('TC-42 (FR-15): double-clicking submit sends exactly one request', async ({ page }, info) => {
  test.skip(!isDesktop(info.project.name), 'desktop submit flow');
  let calls = 0;
  await page.route('https://inquiry.test/submit', async (route) => {
    calls++;
    await new Promise((resolve) => setTimeout(resolve, 400));
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  await fillValidForm(page);
  await page.getByRole('button', { name: 'SUBMIT TATTOO INQUIRY' }).dblclick();
  await expect(page.getByRole('button', { name: 'SENDING…' })).toBeDisabled();
  await expect(page.getByText(/^Thank you for your inquiry!/)).toBeVisible();
  expect(calls).toBe(1);
});
