# Review: studio-website

- **Verdict:** APPROVED
- **Commit reviewed:** 428141c (branch `feature/studio-website`, diff `main...HEAD`, 60 files, +9610/-3)
- **Spec:** docs/specs/studio-website.md
- **Build and tests (run by the reviewer):** `npm run lint` → pass, no output; `npm test` → 7 files, 70/70 tests pass; `npm run build` → `tsc -b && vite build` succeeds; `npm run test:e2e` → 54 passed, 22 skipped, 0 failed (Chromium 1440×900 and 375×812, excluding port 5180)
- **QA report:** docs/test-reports/studio-website.md agrees with my run (lint pass, unit 70/70, build pass, e2e 54/22/0)

## Requirements coverage

| AC | Implemented in | Tested by | Status |
|---|---|---|---|
| AC-1 | TopBar, Navbar, Hero, TrustBar | e2e TC-1 | Pass |
| AC-2 | TopBar.tsx:12 (mapsUrl + rel) | e2e TC-2 | Pass |
| AC-3 | Navbar.tsx:36-44, index.css:11 (`scroll-margin-top`) | e2e TC-3 ×5 | Pass |
| AC-4 | Navbar.tsx:27 (`sticky top-0 z-50`) | e2e TC-4 | Pass |
| AC-5 | Hero.tsx:16, Navbar.tsx:47, TopBar.tsx:16 | e2e TC-5 | Pass |
| AC-6 | TopBar.tsx:21-29, Navbar.tsx:36/53 | e2e TC-6 | Pass |
| AC-7 | Navbar.tsx:14-24, 76 | e2e TC-7, unit TC-7 ×2 | Pass |
| AC-8 | Portfolio.tsx:19, lib/portfolio.ts:5 | unit TC-8, e2e TC-9 | Pass |
| AC-9 | Portfolio.tsx:39 | unit TC-9, e2e TC-9 | Pass |
| AC-10 | Portfolio.tsx:53-54 | unit TC-10 | Pass |
| AC-11 | Portfolio.tsx:81 (`group-hover` / `group-focus-within` / `hover:none`) | unit TC-11, e2e TC-11 ×2 | Pass |
| AC-12 | Portfolio.tsx:91, BookingContext.tsx:21-24, tattooData.ts:93-99 | e2e TC-12 ×5 | Pass |
| AC-13 | Portfolio.tsx:66-69, Lightbox.tsx:81-108 | unit TC-13, e2e TC-13 | Pass |
| AC-14 | Lightbox.tsx:25-33, 76-78, 96; Portfolio.tsx:105-108 | unit TC-14 ×3, e2e TC-13 | Pass |
| AC-15 | lib/portfolio.ts:10-13, Lightbox.tsx:37-48 | unit TC-15, e2e TC-15 | Pass |
| AC-16 | Lightbox.tsx:49-65 | unit TC-16, e2e TC-16 | Pass |
| AC-17 | Pricing.tsx:11-39 | e2e TC-17 | Pass |
| AC-18 | Pricing.tsx:29, tattooData.ts:192-210 | e2e TC-18 ×3 | Pass |
| AC-19 | CareGuide.tsx:8, 26 | unit TC-19 | Pass |
| AC-20 | CareGuide.tsx:17-24, 43 | unit TC-20 ×2 | Pass |
| AC-21 | Reviews.tsx:9-20, ui.tsx:20-28 | unit TC-21 | Pass |
| AC-22 | Faq.tsx:8, 42 | unit TC-22 | Pass |
| AC-23 | Faq.tsx:10-16 | unit TC-23 | Pass |
| AC-24 | BookingForm.tsx:89-94, inquirySchema.ts:13-31 | unit TC-24 ×2 | Pass |
| AC-25 | inquirySchema.ts:14 | unit TC-25 ×3 | Pass |
| AC-26 | inquirySchema.ts:15 | unit TC-26 ×4 | Pass |
| AC-27 | inquirySchema.ts:25-29, BookingForm.tsx:262/269 | unit TC-27, e2e TC-27 | Pass |
| AC-28 | inquirySchema.ts:30 | unit TC-28 ×2 | Pass |
| AC-29 | inquirySchema.ts:53-68, BookingForm.tsx:82-87 | unit TC-29, e2e TC-29 | Pass |
| AC-30 | inquirySchema.ts:57-60 | unit TC-30 ×3, e2e TC-30 | Pass |
| AC-31 | BookingForm.tsx:240-243 | unit TC-29/31, e2e TC-29 | Pass |
| AC-32 | BookingForm.tsx:89-94, 300-302, submitInquiry.ts:3-11 | unit TC-32 ×2, e2e TC-32 | Pass |
| AC-33 | submitInquiry.ts:24-32, BookingForm.tsx:294-298 | unit TC-33 ×3, e2e TC-33 | Pass |
| AC-34 | submitInquiry.ts:20-23 | unit TC-34 ×2 | Pass |
| AC-35 | BookingForm.tsx:23-49 (labels), 180-217 (drop zone) | unit TC-35, e2e TC-35 | Pass |
| AC-36 | Footer.tsx:8-64 | e2e TC-36 | Pass |
| AC-37 | index.html:2-46 | e2e TC-37 | Pass |
| AC-38 | index.css:20-24, App.tsx:17-19, ui.tsx:11-14 | e2e TC-38 | Pass |
| AC-39 | — | e2e TC-39 (both projects) | Pass |
| AC-40 | .github/workflows/ci.yml | my run + e2e TC-40 | Pass |

No acceptance criterion is unimplemented. Two behaviours were added that the spec did not ask for: the reviews/FAQ section eyebrows and headings (`tattooData.ts:282`, `305`) are new copy, and the navbar CTA stays visible from `sm` up while links collapse only below `lg` (`Navbar.tsx:47`). Neither conflicts with the spec.

## Blockers
None.

## Should fix

- R-1: File type check accepts a wrong MIME type when the filename ends in `.png/.jpg` (`inquirySchema.ts:57` tests MIME **or** extension). Verified in the browser: `report.png` with `application/pdf` and `renamed.png` with `image/gif` are both accepted and listed; FR-14 says PNG or JPG only. Not a blocker because AC-30's named cases pass, the check is a UX guard, and the external form service must re-validate uploads.
- R-2 (#2): `aria-controls` IDREFs that do not resolve — `Navbar.tsx:55` (`mobile-menu` absent while closed) and `CareGuide.tsx:41` (`care-panel-after` absent while unselected); WAI-ARIA expects every panel to exist and be hidden. Verified by DOM probe (2 broken IDREFs on desktop).
- R-3 (#3): `btnPrimary` hovers to `accent-gold-light` (#F59E0B) instead of the Appendix C hover token `accent-gold-hover` (#B45309) — `ui.tsx:7`; verified computed `rgb(245, 158, 11)` on the navbar CTA. `accent-gold-hover` (`tailwind.config.ts:14`) is then unused.
- R-4: The submit request has no timeout/abort — `submitInquiry.ts:25`. Verified: with a request that never answers, the button still reads "SENDING…" and stays disabled after 12 s, so the form is unusable until reload. Not spec'd, but a real dead end on a bad network.
- R-5 (#1): Flaky mobile scroll assertions — `e2e/site.spec.ts:9-17` polls a fixed position for 5 s without waiting for the smooth scroll to settle; QA saw 2/56 executions fail, my full run was green. A flaky acceptance test on CI (with `retries: 1`) can hide a real regression.
- R-6: `CLAUDE.md:3` still contains the Portuguese line "instrucoes na primeira msg", which breaks the repository's English-only convention; line 5 also describes a stale pipeline that does not match the current workflow.

## Suggestions

- R-7: The file input has two `<label>`s (`BookingForm.tsx:181` and `196`), so its accessible name is "Reference Images (Up to 3) Drag and drop images here, or choose files"; axe reports `form-field-multiple-labels` as needing manual review on `#referenceImages`.
- R-8: The axe scan only covers the default page. On mobile, colour contrast for the card overlay text is left "incomplete" (background gradient) and the error, empty, lightbox and success states are never scanned, so AC-39's "colour contrast included" is only partly evidenced.
- R-9: Choosing a link in the mobile menu (`Navbar.tsx:76`) unmounts the focused element, so focus falls to `<body>`; verified in the browser.
- R-10: `categoryLabel` and `formStyleFor` (`lib/portfolio.ts:15-21`) repeat the same `portfolioCategories.find`; one lookup map would remove the near-duplicate.
- R-11: `Studio.tsx:9-13` re-implements the fade-in wrapper from `Section` (`ui.tsx:44-49`); a shared wrapper would keep reduced-motion handling in one place.
- R-12: `Portfolio.test.tsx:44-45` asserts Tailwind class names instead of behaviour; the computed opacity is already covered by e2e TC-11, so the unit assertion only couples the test to the implementation.

## Spec notes for the Analyst

- AC-18 / FR-8 map the "Minimum & Small Pieces" card ("Starting at $120 CAD", "up to 2 inches") to **Small (2–4")**, while the size list has **Tiny (1–2")**. The code follows AC-18 literally, but clients asking for a minimum piece will submit a size that contradicts the card. Confirm which is intended.
- FR-3 requires a gradient mask on the hero image without a viewport scope; the code applies it at `lg` and up (`Hero.tsx:29`). Works on mobile, but the spec wording should say "on desktop".
- FR-19 lists "button hover" among the framer-motion animations; buttons use CSS `transition-colors` and only the hover colour token differs (R-3). Clarify whether the CSS transition is acceptable under reduced motion (it currently stays).

## Not reviewed

- Real delivery to the external form service, server-side validation and file storage (no server in this repo; requests are intercepted in tests).
- Firefox and WebKit/Safari behaviour (Playwright only runs Chromium).
- Visual fidelity against `docs/design/homepage-mockup.png` beyond a rough pass in the browser.
- Mutation testing of the logic under test: I do not modify production code, so I judged test strength by reading and by targeted browser probes instead of inverting conditions.
