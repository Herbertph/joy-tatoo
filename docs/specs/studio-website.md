# Spec: Joy Tattoo studio website (MVP)

Branch: `feature/studio-website`
Visual reference: `docs/design/homepage-mockup.png` (top bar, navbar, hero and "Why Choose Joy Tattoo" bar on desktop).

## Context

Joy Tattoo is a boutique tattoo studio at 700 Main St Unit 303, Moncton, NB E1C 1E7, Canada (Downtown Moncton). It works by appointment, with occasional walk-in days. The studio has **no public phone line**: the website is the main way clients find the studio, see the work, understand prices and send a consultation/quote request.

Users: people in Greater Moncton (Moncton, Dieppe, Riverview, Shediac, Sackville) looking for a private, clean, inclusive studio. Most arrive on a phone from Instagram or Google.

The site is a single page with anchored sections, in English, using the "Boutique Dark & Burnished Gold" look.

## Scope

### In scope

- Project setup: Vite + React 18 + TypeScript (strict) + Tailwind CSS 3.4, lucide-react, framer-motion, react-hook-form + zod; Vitest + Testing Library; Playwright; GitHub Actions CI (lint, unit, build, e2e).
- One page with 11 sections: top bar, sticky navbar, hero, trust bar, portfolio gallery with filters and lightbox, pricing, studio/artists, preparation & aftercare tabs, reviews + FAQ accordion, consultation & quote form, footer.
- Design tokens (colours, fonts) in the Tailwind config.
- All site content in one typed data file `src/data/tattooData.ts`.
- Local SEO: title, meta description, Open Graph tags, `TattooParlor` JSON-LD in `<head>`.
- Responsive layout (360px phones to wide desktop), keyboard and screen reader friendly, respects `prefers-reduced-motion`.
- Placeholder images, clearly marked, until the studio sends real photos.

### Out of scope (later features)

- Real online calendar, payment of deposits, user accounts.
- Admin area or CMS to edit portfolio/prices.
- Walk-in day banner managed from outside the code.
- French version.
- Hosting/deploy and the `joytattoo.ca` domain.
- Live Google reviews (reviews are static copy).

## Functional requirements

- **FR-1 Top bar.** A 36px bar above the navbar, background `#070709`, 12px text `#A1A1AA`. Left: map-pin icon (gold) + address, a link that opens Google Maps for the address in a new tab (`target="_blank" rel="noopener noreferrer"`). Right: sparkle icon + "Downtown Moncton • Custom Ink & Walk-Ins", which smooth-scrolls to `#booking`. Below the `md` breakpoint it shows one centred line: "700 Main St Unit 303, Moncton • Book Online" (address part links to Maps, "Book Online" scrolls to `#booking`).
- **FR-2 Navbar.** Sticky (`top-0`, `z-50`), `backdrop-blur-md`, background `#0B0B0D` at 95% opacity, 1px gold bottom border. Logo "JOY TATTOO" left (links to top). Links HOME, PORTFOLIO, ARTISTS, AFTERCARE, FAQ smooth-scroll to `#home`, `#portfolio`, `#artists`, `#aftercare`, `#faq`. CTA "BOOK A CONSULTATION" right, scrolls to `#booking`. Sections are not hidden under the sticky header after scrolling (`scroll-margin-top`). Below `lg`, links collapse into a menu button (`aria-expanded`, `aria-controls`); choosing a link closes the menu; Escape closes it.
- **FR-3 Hero** (`#home`). Two columns on desktop (55% text / 45% image), stacked on mobile. Exact copy in Appendix A. "BOOK A CONSULTATION" scrolls to `#booking`; "VIEW PORTFOLIO" scrolls to `#portfolio`. The image has a `#27272A` border, a soft gradient mask on its left edge on desktop (`lg` and up; on mobile the image is stacked and needs no mask) and meaningful `alt` text. The H1 is the only `h1` on the page.
- **FR-4 Trust bar.** Heading "Why Choose Joy Tattoo", three columns (one on mobile), background `#111114`, thin gold lines above and below. Copy and icons in Appendix A. The 5 stars have one accessible label ("Rated 5 out of 5 stars"), not five.
- **FR-5 Portfolio** (`#portfolio`). Filter buttons: All Work, Fine Line, Black & Grey, Botanical & Floral, Traditional & Bold, Cover-Ups. "All Work" is active on load. The active filter is shown visually and with `aria-pressed="true"`. Selecting a filter shows only items of that category, with no page reload. If a category has no items, show "New pieces in this style are coming soon." instead of an empty grid. The grid shows 8 items from the data file (at least one per category).
- **FR-6 Portfolio card.** On hover and on keyboard focus, the card reveals the piece title, its style name and a "Request Similar Style" button. On touch screens this info is always visible (no hover needed). Clicking the image opens the lightbox. "Request Similar Style" scrolls to `#booking` and preselects the matching Tattoo Style in the form (mapping in Technical notes).
- **FR-7 Lightbox.** A modal dialog (`role="dialog"`, `aria-modal="true"`, labelled by the piece title) showing the large image, title, style and session time. Closes with the close button, Escape, or a click on the backdrop. Focus moves into the dialog on open, stays inside it, and returns to the card that opened it on close. Page scroll is locked while open. Previous/next buttons (and Left/Right arrow keys) move through the items of the **current filter**, wrapping around at the ends.
- **FR-8 Pricing** (`#pricing`). Three cards (one column below `lg`), copy in Appendix A. The middle card has a gold border, a glow and a "MOST REQUESTED" badge, and its button is solid gold. Buttons scroll to `#booking` and preselect Approximate Size: Card 1 → "Small (2–4")", Card 2 → "Medium (4–6")", Card 3 → "Large (6"+ / Sleeve)". The deposit policy notice is shown under the cards.
- **FR-9 Studio & Artists** (`#artists`). Two equal columns (stacked on mobile): studio interior image left, text right. Copy in Appendix A.
- **FR-10 Preparation & Aftercare** (`#aftercare`). Two tabs, "Before Your Session" (selected on load) and "Healing & Aftercare", using the WAI-ARIA tabs pattern (`role="tablist"`, `tab`, `tabpanel`, `aria-selected`; Left/Right arrow keys move between tabs). Switching tabs swaps the content without a reload. Copy in Appendix A.
- **FR-11 Reviews** (`#reviews`). Three testimonial cards with quote, name, city and 5 stars (one accessible label per card). Copy in Appendix A.
- **FR-12 FAQ** (`#faq`). Accordion with 5 questions, all closed on load. Each question is a button with `aria-expanded` and `aria-controls`; clicking or pressing Enter/Space toggles its answer. Several answers may be open at the same time. Copy in Appendix A.
- **FR-13 Consultation & Quote form** (`#booking`). Fields, labels and rules in the form table below. Every field has a visible `<label>`. Required fields are marked with `*`. Validation runs on submit and then on change for fields already touched. Each error shows under its field, is linked with `aria-describedby`, and the field gets `aria-invalid="true"`. On a failed submit, focus moves to the first invalid field.
- **FR-14 Reference images.** Up to 3 files, PNG or JPG only, max 5 MB each, chosen by file picker or drag and drop onto the drop zone. Selected files are listed by name with a "Remove" button for each. Adding a 4th file, a wrong type or a file over 5 MB is rejected with a message naming the file and the reason; the already selected files stay.
- **FR-15 Submit.** The button "SUBMIT TATTOO INQUIRY" (full width, gold) sends the data as `multipart/form-data` to the inquiry endpoint (see Technical notes). While sending, the button is disabled and reads "SENDING…", so double clicks do not send twice. On success, the form is replaced by the success message (Appendix A), which receives focus. On a server error or network failure, all entered data stays in the form and an error message is shown in an `role="alert"` region: "Sorry, we couldn't send your inquiry. Please try again in a moment, or message us on Instagram." If no endpoint is configured, the form behaves like a failure and logs a console warning (it must never pretend a request was sent).
- **FR-16 Footer.** Background `#070709`, 1px `#27272A` top border, four columns on desktop (stacked on mobile), copy in Appendix A. Quick links scroll to their sections. Instagram, Facebook and Google Maps links open in a new tab. Bottom bar: "© 2026 Joy Tattoo. All rights reserved. | 700 Main St Unit 303, Moncton, NB." — the year comes from the current date.
- **FR-17 SEO.** `<html lang="en">`. Title "Joy Tattoo | Custom Tattoo Studio in Downtown Moncton, NB". Meta description mentioning custom, fine-line and blackwork tattoos at 700 Main St, Moncton. Open Graph title, description, image and type. The `TattooParlor` JSON-LD from Appendix B in `<head>`.
- **FR-18 Design system.** Colour tokens from Appendix C in `tailwind.config`, used by name in the components (no raw hex values in components). Headings in Cormorant Garamond, uppercase tags/eyebrows in Montserrat, body in Inter (400/500/600), body line height 1.25–1.35. Buttons `rounded-md`, colour transitions `duration-200 ease-in-out`. Fonts are self-hosted or loaded with `font-display: swap`.
- **FR-19 Motion.** framer-motion is used for small things only: section fade-in on scroll, lightbox and mobile menu open/close, accordion and tab transitions. Button hover is a plain CSS colour transition (`duration-200 ease-in-out`, FR-18) and may stay on under reduced motion, since it does not move anything. With `prefers-reduced-motion: reduce`, these animations are turned off and smooth scrolling becomes instant.
- **FR-20 Placeholder images.** Every image path lives in `tattooData.ts` with a `placeholder: boolean` flag. Placeholders are royalty-free images stored in the repo (licence noted in `public/images/CREDITS.md`) or neutral generated images; no hot-linked external images.

### Form fields

| Field id | Label | Element | Rules |
|---|---|---|---|
| `fullName` | Full Name * | text | Required, trimmed, 2–80 characters. Error: "Please enter your full name." |
| `email` | Email Address * | email | Required, valid email. Error: "Please enter a valid email address." |
| `socialContact` | Instagram Handle or SMS Number | text | Optional, max 60 characters. |
| `tattooStyle` | Tattoo Style * | select | Required. Placeholder option "Select a style" (not valid). Options: Fine Line, Black & Grey, Colour, Botanical / Floral, Script / Lettering, Traditional / Bold, Cover-Up, Flash Design. Error: "Please choose a tattoo style." |
| `bodyPlacement` | Body Placement * | text | Required, trimmed, 2–80 characters. Placeholder "e.g. Inner Forearm, Upper Arm, Ribs, Ankle". Error: "Please tell us where on your body." |
| `approxSize` | Approximate Size * | select | Required. Options: Tiny (1–2"), Small (2–4"), Medium (4–6"), Large (6"+ / Sleeve). Error: "Please choose an approximate size." |
| `budgetRange` | Budget Range | select | Optional. Options: $120–$200, $200–$450, $450–$800, $800+. |
| `referenceImages` | Reference Images (Up to 3) | file input + drop zone | Optional. See FR-14. Helper text: "PNG or JPG, up to 5 MB each." |
| `projectDescription` | Idea Description & Preferred Days * | textarea | Required, trimmed, 10–2000 characters, with a character counter. Error: "Please describe your idea (at least 10 characters)." |
| `ageCheck` | Age Confirmation * | checkbox | Must be checked. Text: "I confirm I am 18 years of age or older and will bring a valid government photo ID." Error: "You must be 18 or older to book." |

## Acceptance criteria

### Layout and navigation

- **AC-1** Given a desktop viewport (1440px), when the page loads, then the top bar, navbar, hero and "Why Choose Joy Tattoo" bar appear in that order with the copy from Appendix A, and the page has exactly one `h1`.
- **AC-2** Given the page, when the user clicks the top bar address, then a new tab opens on Google Maps searching "700 Main St Unit 303, Moncton, NB E1C 1E7" (link has `target="_blank"` and `rel` containing `noopener`).
- **AC-3** Given the page, when the user clicks each navbar link (HOME, PORTFOLIO, ARTISTS, AFTERCARE, FAQ), then the matching section is scrolled into view and its heading is not covered by the sticky navbar.
- **AC-4** Given the user has scrolled to the footer, then the navbar is still visible at the top of the viewport.
- **AC-5** Given the page, when the user clicks "BOOK A CONSULTATION" (navbar or hero) or the top bar "Custom Ink & Walk-Ins" text, then the `#booking` form is scrolled into view.
- **AC-6** Given a 375px phone viewport, when the page loads, then the top bar shows the single line "700 Main St Unit 303, Moncton • Book Online", nav links are hidden behind a menu button, and no element causes horizontal scrolling.
- **AC-7** Given the mobile menu is open, when the user picks a link, then the menu closes and the section is scrolled into view; when the user presses Escape instead, the menu closes and focus returns to the menu button.

### Portfolio

- **AC-8** Given the portfolio loads, then "All Work" is pressed and all 8 items are shown.
- **AC-9** Given the portfolio, when the user selects "Fine Line", then only fine-line items are shown, "Fine Line" has `aria-pressed="true"` and the other filters `false`; selecting "All Work" shows all 8 again.
- **AC-10** Given a category with no items (tested with unit-level data), when it is selected, then the text "New pieces in this style are coming soon." is shown instead of the grid.
- **AC-11** Given a portfolio card, when it gets keyboard focus or mouse hover, then its title, style and "Request Similar Style" button become visible.
- **AC-12** Given a "Botanical & Floral" card, when the user clicks "Request Similar Style", then `#booking` is scrolled into view and Tattoo Style shows "Botanical / Floral". The same holds for each category per the mapping table.
- **AC-13** Given the portfolio, when the user clicks a card image, then a dialog opens showing that piece's title, style and session time, and focus is inside the dialog.
- **AC-14** Given the lightbox is open, when the user presses Escape, clicks the close button, or clicks the backdrop, then the dialog closes and focus returns to the card that opened it.
- **AC-15** Given the "Fine Line" filter is active and the lightbox shows the last fine-line item, when the user presses "Next" (or Right arrow), then the first fine-line item is shown (navigation stays inside the filter and wraps).
- **AC-16** Given the lightbox is open, when the user presses Tab repeatedly, then focus never leaves the dialog.

### Pricing

- **AC-17** Given the pricing section, then three cards show the titles, prices, details and buttons from Appendix A, the middle card shows the "MOST REQUESTED" badge, and the deposit notice is visible.
- **AC-18** Given the pricing section, when the user clicks "Inquire Small Piece", "Start Custom Project" or "Book Full Session", then `#booking` is in view and Approximate Size shows "Small (2–4")", "Medium (4–6")" or "Large (6"+ / Sleeve)" respectively.

### Aftercare tabs, reviews, FAQ

- **AC-19** Given the aftercare section loads, then "Before Your Session" is selected (`aria-selected="true"`) and its four items are shown.
- **AC-20** Given the aftercare section, when the user clicks "Healing & Aftercare" (or focuses the first tab and presses Right arrow), then that tab is selected and its four items replace the previous ones without a page reload.
- **AC-21** Given the reviews section, then three testimonials show the quotes, names and cities from Appendix A, each with a "Rated 5 out of 5 stars" label.
- **AC-22** Given the FAQ loads, then all 5 questions are visible and all answers are hidden (`aria-expanded="false"`).
- **AC-23** Given the FAQ, when the user activates a question (click, Enter or Space), then its answer is shown and `aria-expanded="true"`; activating it again hides it. Opening a second question leaves the first open.

### Form

- **AC-24** Given the empty form, when the user clicks "SUBMIT TATTOO INQUIRY", then no request is sent, the required fields (Full Name, Email, Tattoo Style, Body Placement, Approximate Size, Idea Description, Age Confirmation) show their error messages, they have `aria-invalid="true"`, and focus is on Full Name.
- **AC-25** Given the form, when Full Name is "A" or only spaces, then "Please enter your full name." is shown on submit.
- **AC-26** Given the form, when Email is "joy@", "joy.com" or empty, then "Please enter a valid email address." is shown on submit; "joy@example.com" is accepted.
- **AC-27** Given the form, when Idea Description has 9 characters, then the error is shown; with 10 characters it is accepted; the counter stops input at 2000 characters.
- **AC-28** Given all required fields are valid but the age box is unchecked, when the user submits, then "You must be 18 or older to book." is shown and no request is sent.
- **AC-29** Given the form, when the user adds 3 valid PNG/JPG images, then their 3 names are listed; when they try to add a 4th, it is rejected with a message and the 3 stay listed.
- **AC-30** Given the form, when the user adds a `.gif`/`.pdf` file or a 6 MB JPG, then it is rejected with a message naming the file and the reason (type or size), and it is not listed.
- **AC-31** Given a listed image, when the user clicks its "Remove" button, then it disappears from the list and another image can be added.
- **AC-32** Given a valid form (with and without optional fields and images), when the user submits and the endpoint answers 2xx, then exactly one `multipart/form-data` request is sent containing all filled fields and the images, the button shows "SENDING…" and is disabled while waiting, and then the success message from Appendix A replaces the form and has focus.
- **AC-33** Given a valid form, when the endpoint answers 4xx/5xx or the network fails, then the error alert from FR-15 is shown, the form keeps every value the user entered (including images), and the user can submit again.
- **AC-34** Given no inquiry endpoint is configured, when a valid form is submitted, then the error alert is shown (no success message) and a warning is logged to the console.
- **AC-35** Given every form control, then each has a visible label and can be reached and operated with the keyboard alone (including the drop zone, through its file input).

### Footer, SEO, quality

- **AC-36** Given the footer, then the four columns show the copy from Appendix A, social links open in a new tab, quick links scroll to their sections, and the copyright shows the current year.
- **AC-37** Given the built page (`dist/index.html`), then it has `lang="en"`, the title from FR-17, a meta description, Open Graph tags and one `application/ld+json` script that parses as JSON with `@type` "TattooParlor" and the address, hours and area served from Appendix B.
- **AC-38** Given `prefers-reduced-motion: reduce`, when the user clicks a nav link or opens the lightbox, then it happens without animation.
- **AC-39** Given the home page, when an automated accessibility scan (axe, via `@axe-core/playwright`) runs on desktop and mobile, then it reports no serious or critical violations (colour contrast included).
- **AC-40** Given `npm run build`, then it succeeds with no TypeScript errors, and `npm run lint`, `npm test` and `npm run test:e2e` all pass in CI.

## Assumptions for Herbert to confirm

1. **Stack:** Vite + React + TypeScript instead of Next.js — the site is one static page, so it is simpler to host and test. JSON-LD and meta tags go straight into `index.html`.
2. **Where inquiries go:** there is no server. The form posts to an external form service (Formspree-style URL) set in the `VITE_INQUIRY_ENDPOINT` environment variable. Until the studio creates that account, the form shows an error instead of a fake "thank you". Note: most free plans do not accept file uploads, so a paid plan or another service may be needed for reference images.
3. **Images:** placeholders until the studio sends real portfolio, hero and studio photos.
4. **Social links:** Instagram and Facebook URLs are placeholder profile URLs (`https://www.instagram.com/joytattoo`, `https://www.facebook.com/joytattoo`), marked `TODO` in `tattooData.ts`, until we get the real ones.
5. **Small copy fixes:** footer logo "JOY TATTO O" becomes "JOY TATTOO"; aftercare "wash your healed tattoo" becomes "wash your healing tattoo". All other copy is used exactly as given.
6. **Added form option "Traditional / Bold"** so "Request Similar Style" on Traditional & Bold cards has a matching style.
7. **Empty `telephone`** is left out of the JSON-LD (an empty value is invalid for Google).
8. **No language switch** (English only) and **no deploy** in this first PR.

## Technical notes

### Stack and commands (developer fills `CLAUDE.md`)

- Vite + React 18 + TypeScript strict, Tailwind CSS 3.4, lucide-react, framer-motion, react-hook-form, zod, @hookform/resolvers.
- Vitest + @testing-library/react + jsdom for unit/component tests.
- Playwright (Chromium desktop 1440×900 and mobile 375×812 projects) + @axe-core/playwright. Playwright's `webServer` must use its own port (e.g. 5180 for preview), **never 4545**.
- Scripts: `dev`, `build`, `preview`, `lint`, `test`, `test:e2e`.
- GitHub Actions workflow running lint, unit tests, build and e2e on pull requests.

### Structure

```
src/
  data/tattooData.ts        # all content: portfolio, pricing, reviews, FAQ, care guide, footer, business info
  lib/inquirySchema.ts      # zod schema + file rules (pure, unit tested)
  lib/submitInquiry.ts      # builds FormData, posts to VITE_INQUIRY_ENDPOINT
  lib/portfolio.ts          # filterByCategory, next/prev index with wrap, category → form style map
  lib/mapsUrl.ts            # Google Maps search URL for the address
  components/               # TopBar, Navbar, Hero, TrustBar, Portfolio, Lightbox, Pricing, Studio,
                            # CareGuide, Reviews, Faq, BookingForm, Footer
  App.tsx
public/images/              # placeholder images + CREDITS.md
```

- Form preselection from portfolio and pricing: a small shared state (React context or a lifted state in `App`) that the form reads with `setValue`, then scrolls to `#booking`.
- In e2e tests, the endpoint is intercepted with `page.route` to simulate 2xx, 5xx and network failure. Build e2e with `VITE_INQUIRY_ENDPOINT` set to a test URL.
- Use `getByRole` / `getByLabel` / `getByText` in tests. Acceptance tests are named with their AC id.

### Portfolio data

`TattooItem` from the brief plus `style` label shown on cards, `alt` text and `placeholder` flag:

```ts
export type PortfolioCategory = 'fine-line' | 'black-grey' | 'botanical' | 'traditional' | 'cover-up';
export interface TattooItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  imageUrl: string;
  alt: string;
  sessionTime: string;
  placeholder: boolean;
}
```

8 items, at least one per category. Example: `{ id: '1', title: 'Micro-Fine Line Botanical Forearm', category: 'fine-line', imageUrl: '/images/portfolio/botanical-fine-line.jpg', sessionTime: '2.5 Hours', ... }`.

| Portfolio category | Filter label | Form Tattoo Style |
|---|---|---|
| `fine-line` | Fine Line | Fine Line |
| `black-grey` | Black & Grey | Black & Grey |
| `botanical` | Botanical & Floral | Botanical / Floral |
| `traditional` | Traditional & Bold | Traditional / Bold |
| `cover-up` | Cover-Ups | Cover-Up |

### Task list for the developer

1. Scaffold Vite + React + TS, Tailwind with tokens (Appendix C), fonts, ESLint, Vitest, Playwright, CI workflow; fill in `CLAUDE.md` (stack, commands, structure).
2. `tattooData.ts` with all copy from Appendix A, placeholder images and `CREDITS.md`.
3. Pure logic + unit tests: `inquirySchema`, file rules, `portfolio` helpers, `mapsUrl`, `submitInquiry`.
4. Layout shell: TopBar, Navbar (sticky, mobile menu), section anchors with scroll margin, Footer.
5. Static sections: Hero, TrustBar, Pricing, Studio, Reviews.
6. Interactive sections: Portfolio + Lightbox, CareGuide tabs, FAQ accordion.
7. BookingForm with validation, file drop zone, submit states and preselection from portfolio/pricing.
8. SEO tags and JSON-LD in `index.html`; reduced-motion handling.
9. Visual check against `docs/design/homepage-mockup.png` on desktop and mobile; axe scan clean.

## Appendix A: exact copy

### Top bar
- Left: `700 Main St Unit 303, Moncton, NB E1C 1E7`
- Right: `Downtown Moncton • Custom Ink & Walk-Ins`
- Mobile: `700 Main St Unit 303, Moncton • Book Online`

### Navbar
- Logo: `JOY TATTOO` (small tagline under it as in the mockup: `BOUTIQUE TATTOO STUDIO`)
- Links: `HOME`, `PORTFOLIO`, `ARTISTS`, `AFTERCARE`, `FAQ`
- CTA: `BOOK A CONSULTATION`

### Hero
- Eyebrow: `CUSTOM TATTOO STUDIO IN MONCTON`
- H1: `ART THAT STAYS. STORIES IN INK.` (in the mockup "STORIES IN INK." is gold)
- H2: `Moncton’s Boutique Tattoo Studio.`
- Paragraph: `From delicate fine-line work to bold custom blackwork and colour pieces, we collaborate with you to bring meaningful art to life in a clean, welcoming Main Street studio.`
- Buttons: `BOOK A CONSULTATION` (primary), `VIEW PORTFOLIO` (secondary, outlined)
- Image: editorial photo of fine-line work being applied under warm focused light.

### Trust bar — `Why Choose Joy Tattoo`
| Icon | Title | Text |
|---|---|---|
| 5 stars (`#FACC15`) | 5-Star Rated Studio | Trusted by clients across Greater Moncton for precision, comfort, and exceptional art. |
| PenTool | Custom Art & Fine Line | One-of-a-kind designs tailored specifically to your anatomy, style preference, and story. |
| ShieldCheck | Hospital-Grade Sterilization | 100% single-use needles, Health Canada approved inks, and strict clinical hygiene protocols. |

### Portfolio
- Eyebrow: `SELECTED WORKS`
- H2: `Crafted With Precision & Intention`
- Text: `Explore recent custom pieces, fine-line work, and healed tattoos created at our Main Street studio.`
- Filters: `All Work`, `Fine Line`, `Black & Grey`, `Botanical & Floral`, `Traditional & Bold`, `Cover-Ups`
- Card button: `Request Similar Style`
- Empty state: `New pieces in this style are coming soon.`

### Pricing
- Eyebrow: `PRICING & SESSIONS`
- H2: `Transparent Rates & Custom Quotes`
- Text: `Every custom tattoo is priced fairly based on size, placement, and level of detail.`
- Card 1 — `Minimum & Small Pieces` — `Starting at $120 CAD` — `Ideal for minimalist symbols, script, micro fine-line, or flash designs up to 2 inches. Includes sterile setup and custom stencil sizing.` — button `Inquire Small Piece`
- Card 2 — `Custom Medium Piece` — badge `MOST REQUESTED` — `$200 – $450 CAD` — `Custom artwork designed from scratch (3 to 6 inches), forearm/calf pieces, botanical compositions, and shaded blackwork. Includes digital mockup review before session.` — button (solid gold) `Start Custom Project`
- Card 3 — `Half-Day & Full-Day Sessions` — `$550 – $950 CAD` — `Dedicated studio time for large-scale pieces, sleeves, back pieces, or complex cover-ups with priority scheduling.` — button `Book Full Session`
- Notice: `Deposit Policy Notice: A $50–$100 non-refundable deposit is required to secure your appointment date and goes directly toward the final price of your tattoo.`

### Studio & Artists
- Eyebrow: `THE MONCTON STUDIO`
- H2: `A Calm, Judgment-Free Space on Main Street`
- P1: `Located in the heart of Downtown Moncton at 700 Main Street (Unit 303), Joy Tattoo was created to offer a refreshing alternative to traditional, intimidating tattoo shops.`
- P2: `We provide a clean, quiet, and welcoming atmosphere where you can feel entirely comfortable throughout your session. Whether it is your very first tattoo or an addition to a growing collection, we take the time to ensure your placement, sizing, and design are absolute perfection.`

### Care guide
- Eyebrow: `CLIENT CARE GUIDE`
- H2: `Before & After Your Session`
- Text: `Proper preparation and aftercare are essential for crisp lines and flawless healing.`
- Tab `Before Your Session`:
  - **Hydration & Meals:** Drink plenty of water in the 24 hours leading up to your appointment. Eat a full meal 1–2 hours before arriving to keep your blood sugar stable.
  - **Skin Preparation:** Avoid sunburns, heavy tanning, or harsh chemical peels on the target area. Do not shave the area yourself if you are prone to razor burn—we will prepare the skin safely.
  - **Substance Restrictions:** Do not consume alcohol or blood-thinning medications for at least 24 hours prior to your session.
  - **What to Wear & Bring:** Wear comfortable, dark clothing that allows easy, non-restrictive access to the tattoo placement. Bring a valid government-issued photo ID (18+ required).
- Tab `Healing & Aftercare`:
  - **Bandage Care:** Keep your second-skin protective bandage on for 3 to 5 days as directed by your artist. If fluid accumulates, this is completely normal.
  - **Washing Instructions:** Gently wash your healing tattoo twice daily using warm water and fragrance-free antibacterial soap. Pat dry with a clean paper towel—never rub.
  - **Moisturizing:** Apply a paper-thin layer of unscented moisturizer or specialized tattoo balm 2–3 times a day. Do not oversaturate the skin.
  - **Activities to Avoid:** No swimming, hot tubs, saunas, or prolonged soaking for 2–3 weeks. Avoid direct sun exposure and never pick or scratch healing skin.

### Reviews
- "Got my first fine-line piece at Joy Tattoo on Main St and couldn't be happier. Super clean studio, gentle hand, and healed crisply." — Camille R. (Moncton, NB) ★★★★★
- "They took my rough idea and turned it into an incredible custom forearm design. Worth every penny—already planning my next session." — Tyler G. (Dieppe, NB) ★★★★★
- "Very welcoming atmosphere and spotless stations. They walked me through every step of sizing and aftercare." — Hannah W. (Riverview, NB) ★★★★★

### FAQ
1. **How do I book an appointment or get a price quote?** Simply fill out our online Consultation & Quote Form below. Provide details about your idea, size, placement, and reference images. We will review your request and respond via email or Instagram within 24–48 hours with a price estimate and available dates.
2. **Do you accept walk-ins at your Main Street studio?** We operate primarily by appointment to ensure dedicated focus for each client. However, we do host select Walk-In days for flash designs, which are announced on our website banner and Instagram stories.
3. **What is the minimum age to get tattooed in New Brunswick?** You must be at least 18 years of age. A valid government-issued photo ID (driver’s license or passport) is required at the time of your appointment. No exceptions or parental consent under 18.
4. **Can you redesign or cover up an existing tattoo?** Yes! We specialize in custom cover-ups and reworks. Please attach clear, well-lit photos of your existing tattoo in the consultation form so we can evaluate your options.
5. **How do deposits and rescheduling work?** A deposit ($50–$100) is required to lock in your date. Deposits are non-refundable but fully transferable to a new date if you provide at least 48 hours’ notice prior to your scheduled time.

### Booking form
- Eyebrow: `START YOUR PROJECT`
- H2: `Book a Consultation or Request a Quote`
- Text: `Fill out the form below with your project details. We will review your request and contact you within 24–48 hours.`
- Submit: `SUBMIT TATTOO INQUIRY` (sending: `SENDING…`)
- Success: `Thank you for your inquiry! We have received your project details. Our team will review your reference images and respond via email or Instagram within 24–48 hours with an estimated quote and available consultation dates.`
- Error: `Sorry, we couldn't send your inquiry. Please try again in a moment, or message us on Instagram.`

### Footer
- Column 1 — Logo `JOY TATTOO`; tagline `Custom tattoo studio located in Downtown Moncton, NB. Dedicated to precision fine-line, blackwork, and custom artwork in a sterile, welcoming space.`; links `Instagram`, `Facebook`, `Google Maps`.
- Column 2 — `Quick Links`: Home, Portfolio, Pricing & Session Guide, Artists & Studio, Client Aftercare, Frequently Asked Questions, Book Consultation.
- Column 3 — `Serving Greater Moncton`: Downtown Moncton, Dieppe, NB, Riverview, NB, Shediac, NB, Sackville, NB.
- Column 4 — `Studio Location & Hours`: Address `700 Main St Unit 303, Moncton, NB E1C 1E7`; Schedule `By Appointment & Select Walk-Ins`; Hours `Tuesday – Saturday: 11:00 AM – 7:00 PM`, `Sunday – Monday: Closed`.
- Bottom bar: `© <current year> Joy Tattoo. All rights reserved. | 700 Main St Unit 303, Moncton, NB.`

## Appendix B: JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "TattooParlor",
  "name": "Joy Tattoo",
  "image": "https://joytattoo.ca/og-image.jpg",
  "@id": "https://joytattoo.ca",
  "url": "https://joytattoo.ca",
  "priceRange": "$$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "700 Main St Unit 303",
    "addressLocality": "Moncton",
    "addressRegion": "NB",
    "postalCode": "E1C 1E7",
    "addressCountry": "CA"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 46.0878, "longitude": -64.7782 },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "opens": "11:00",
    "closes": "19:00"
  },
  "areaServed": ["Moncton", "Dieppe", "Riverview", "Shediac", "Sackville"]
}
```

## Appendix C: design tokens

| Token | Hex | Use |
|---|---|---|
| `bg-primary` | `#0B0B0D` | Page background |
| `bg-secondary` | `#141418` | Pricing cards, form container, drawers |
| `bg-band` | `#111114` | Trust bar background |
| `bg-chrome` | `#070709` | Top bar and footer |
| `border-subtle` | `#27272A` | Dividers, card borders |
| `accent-gold` | `#D97706` | Highlights, thin dividers, primary CTAs, focus rings |
| `accent-gold-hover` | `#B45309` | Primary button hover |
| `accent-gold-light` | `#F59E0B` | Glows and highlights |
| `text-primary` | `#F8FAFC` | Headings and body |
| `text-secondary` | `#A1A1AA` | Descriptions, labels, metadata |
| `rating-star` | `#FACC15` | Star icons |

Glow example: `shadow-[0_0_25px_rgba(217,119,6,0.15)]` (define it as a named shadow token).
