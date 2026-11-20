# Test cases: Joy Tattoo studio website (MVP)

Spec: `docs/specs/studio-website.md`
Branch: `feature/studio-website`
Author: Senior QA (tester-agent)

Test design uses equivalence partitioning (valid / invalid / empty / placeholder option), boundary values (2/3 and 80/81 characters, 9/10 and 2000/2001 characters, 60/61 characters, 3/4 files, 5 MB/6 MB, first/last item in the lightbox) and error guessing (double submit, special characters, rapid filter clicks, drag and drop, keyboard-only journeys, reduced motion).

## Traceability summary

| AC | TC | Priority | Result |
|---|---|---|---|
| AC-1 | TC-1 | high | Pass |
| AC-2 | TC-2 | high | Pass |
| AC-3 | TC-3 | high | Pass |
| AC-4 | TC-4 | medium | Pass |
| AC-5 | TC-5 | high | Pass |
| AC-6 | TC-6 | high | Pass |
| AC-7 | TC-7 | high | Pass |
| AC-8 | TC-8 | high | Pass |
| AC-9 | TC-9 | high | Pass |
| AC-10 | TC-10 | medium | Pass |
| AC-11 | TC-11 | high | Pass |
| AC-12 | TC-12 | high | Pass |
| AC-13 | TC-13 | high | Pass |
| AC-14 | TC-14 | high | Pass |
| AC-15 | TC-15 | medium | Pass |
| AC-16 | TC-16 | medium | Pass |
| AC-17 | TC-17 | high | Pass |
| AC-18 | TC-18 | high | Pass |
| AC-19 | TC-19 | high | Pass |
| AC-20 | TC-20 | high | Pass |
| AC-21 | TC-21 | medium | Pass |
| AC-22 | TC-22 | high | Pass |
| AC-23 | TC-23 | high | Pass |
| AC-24 | TC-24 | high | Pass |
| AC-25 | TC-25 | high | Pass |
| AC-26 | TC-26 | high | Pass |
| AC-27 | TC-27 | high | Pass |
| AC-28 | TC-28 | high | Pass |
| AC-29 | TC-29 | high | Pass |
| AC-30 | TC-30 | high | Pass |
| AC-31 | TC-31 | medium | Pass |
| AC-32 | TC-32 | high | Pass (flaky e2e, #1) |
| AC-33 | TC-33 | high | Pass |
| AC-34 | TC-34 | high | Pass |
| AC-35 | TC-35 | high | Pass |
| AC-36 | TC-36 | high | Pass |
| AC-37 | TC-37 | high | Pass |
| AC-38 | TC-38 | medium | Pass |
| AC-39 | TC-39 | high | Pass |
| AC-40 | TC-40 | high | Pass |
| FR-5 (exploration) | TC-45 | low | Pass |
| FR-13 (exploration) | TC-43, TC-44, TC-46 | medium | Pass |
| FR-14 (exploration) | TC-41 | medium | Pass |
| FR-15 (exploration) | TC-42 | medium | Pass |
| FR-2, FR-10 (exploration) | TC-47 | medium | Fail (#2) |
| Appendix C, FR-18 (exploration) | TC-48 | low | Fail (#3) |

Legend: `#1` is the flaky-test issue (the two e2e tests pass on retry; see the report).

## Layout and navigation

### TC-1: desktop page order, copy and a single h1
- **Acceptance criterion:** AC-1
- **Priority:** high
- **Type:** functional
- **Preconditions:** Built site served at the test URL; desktop viewport 1440×900.
- **Test data:** none.
- **Steps:**
  1. Load `/`.
  2. Locate the top bar address link, the main navigation, the H1 and the "Why Choose Joy Tattoo" heading.
  3. Read their bounding-box `y` positions.
  4. Count `h1` elements.
- **Expected result:** The four elements are visible in that order (each lower than the previous); the Hero H1 reads "ART THAT STAYS. STORIES IN INK."; "Downtown Moncton • Custom Ink & Walk-Ins", "Moncton's Boutique Tattoo Studio." and "5-Star Rated Studio" are visible; exactly one `h1`.
- **Automated by:** `e2e/site.spec.ts` › `TC-1 (AC-1): top bar, navbar, hero and trust bar appear in order with one h1`
- **Status:** Pass

### TC-2: top bar address opens Google Maps in a new tab
- **Acceptance criterion:** AC-2
- **Priority:** high
- **Type:** functional
- **Preconditions:** desktop viewport.
- **Test data:** address `700 Main St Unit 303, Moncton, NB E1C 1E7`.
- **Steps:**
  1. Load `/`.
  2. Inspect the top bar address link attributes.
- **Expected result:** `target="_blank"`, `rel` contains `noopener`, host `www.google.com`, `query` parameter equal to the full address.
- **Automated by:** `e2e/site.spec.ts` › `TC-2 (AC-2): top bar address opens Google Maps in a new tab`
- **Status:** Pass

### TC-3: navbar links scroll each section heading below the sticky navbar
- **Acceptance criterion:** AC-3
- **Priority:** high
- **Type:** functional
- **Preconditions:** desktop viewport, page at top.
- **Test data:** HOME→`#home`, PORTFOLIO→`#portfolio`, ARTISTS→`#artists`, AFTERCARE→`#aftercare`, FAQ→`#faq`.
- **Steps:**
  1. For each link: click it in the main navigation.
  2. Poll the target section's first heading position.
- **Expected result:** The heading is inside the viewport and its top is at or below the sticky navbar bottom (not covered).
- **Automated by:** `e2e/site.spec.ts` › `TC-3 (AC-3): <LABEL> scrolls to #<id> without hiding its heading` (5 cases)
- **Status:** Pass

### TC-4: navbar stays visible at the footer
- **Acceptance criterion:** AC-4
- **Priority:** medium
- **Type:** functional
- **Preconditions:** page loaded.
- **Steps:**
  1. Scroll the footer into view.
  2. Read the `header` bounding box.
- **Expected result:** `header.y === 0` and the header is in the viewport.
- **Automated by:** `e2e/site.spec.ts` › `TC-4 (AC-4): navbar stays visible after scrolling to the footer`
- **Status:** Pass

### TC-5: booking CTAs scroll to the form
- **Acceptance criterion:** AC-5
- **Priority:** high
- **Type:** functional
- **Preconditions:** desktop viewport, page scrolled to top before each trigger.
- **Test data:** navbar CTA, hero CTA, top bar "Downtown Moncton • Custom Ink & Walk-Ins".
- **Steps:**
  1. Click each trigger.
  2. Poll the "Book a Consultation or Request a Quote" heading position.
- **Expected result:** The form heading is in view and below the sticky navbar for all three triggers.
- **Automated by:** `e2e/site.spec.ts` › `TC-5 (AC-5): booking CTAs scroll to the form`
- **Status:** Pass

### TC-6: 375px phone layout
- **Acceptance criterion:** AC-6
- **Priority:** high
- **Type:** functional
- **Preconditions:** mobile project, 375×812, touch.
- **Steps:**
  1. Load `/`.
  2. Read the top bar, the menu button and the desktop nav links.
  3. Compare `documentElement.scrollWidth` with the viewport width.
- **Expected result:** Single centred line "700 Main St Unit 303, Moncton • Book Online"; "Open menu" button visible; PORTFOLIO link hidden; no horizontal overflow.
- **Automated by:** `e2e/site.spec.ts` › `TC-6 (AC-6): phone layout shows the short top bar, a menu button and no horizontal scroll`
- **Status:** Pass

### TC-7: mobile menu closes on link or Escape, focus returns
- **Acceptance criterion:** AC-7
- **Priority:** high
- **Type:** functional, accessibility
- **Preconditions:** mobile project.
- **Steps:**
  1. Open the menu; choose FAQ.
  2. Verify the menu is gone and the FAQ heading is below the navbar.
  3. Re-open the menu; press Escape.
- **Expected result:** Menu closes in both cases; choosing FAQ shows the FAQ section; Escape returns focus to the menu button.
- **Automated by:** `e2e/site.spec.ts` › `TC-7 (AC-7): mobile menu link closes the menu and scrolls; Escape returns focus`; `src/components/Sections.test.tsx` › `TC-7 (AC-7): picking a link closes the menu`; `src/components/Sections.test.tsx` › `TC-7 (AC-7): Escape closes the menu and returns focus to the button`
- **Status:** Pass

## Portfolio

### TC-8: default filter and item count
- **Acceptance criterion:** AC-8
- **Priority:** high
- **Type:** functional
- **Preconditions:** Portfolio rendered.
- **Steps:**
  1. Read the filter button states.
  2. Count the card image buttons.
- **Expected result:** "All Work" has `aria-pressed="true"`; all 8 cards are shown.
- **Automated by:** `src/components/Portfolio.test.tsx` › `TC-8 (AC-8): starts on "All Work" with all 8 items`
- **Status:** Pass

### TC-9: filtering to Fine Line and back
- **Acceptance criterion:** AC-9
- **Priority:** high
- **Type:** functional
- **Preconditions:** Portfolio rendered; live site for the e2e case.
- **Test data:** Fine Line (2 items), All Work (8 items).
- **Steps:**
  1. Select "Fine Line".
  2. Read `aria-pressed` on all six filters and the visible cards.
  3. Select "All Work" again.
- **Expected result:** Only fine-line cards are shown; Fine Line is pressed, the other five are not; All Work restores 8 cards without a page reload.
- **Automated by:** `src/components/Portfolio.test.tsx` › `TC-9 (AC-9): filters to Fine Line and back to All Work`; `e2e/site.spec.ts` › `TC-9 (AC-9): Fine Line shows only fine-line cards and sets aria-pressed`
- **Status:** Pass

### TC-10: empty category state
- **Acceptance criterion:** AC-10
- **Priority:** medium
- **Type:** functional
- **Preconditions:** Portfolio rendered with unit-level data where `cover-up` has no items.
- **Steps:**
  1. Select "Cover-Ups".
- **Expected result:** "New pieces in this style are coming soon." is shown instead of the grid.
- **Automated by:** `src/components/Portfolio.test.tsx` › `TC-10 (AC-10): shows the empty state for a category with no items`
- **Status:** Pass

### TC-11: card overlay reveal on hover/focus and always visible on touch
- **Acceptance criterion:** AC-11
- **Priority:** high
- **Type:** functional, accessibility
- **Preconditions:** desktop project and mobile project.
- **Steps:**
  1. Desktop: read the overlay opacity before hovering.
  2. Hover the card, then move the mouse away, then focus "Request Similar Style".
  3. Mobile: read the overlay opacity without interacting.
- **Expected result:** Desktop opacity 0 → 1 on hover → 0 after leaving → 1 on keyboard focus; title, style and the button are present; touch opacity is always 1.
- **Automated by:** `e2e/site.spec.ts` › `TC-11 (AC-11): card info is hidden until hover or focus on desktop`; `e2e/site.spec.ts` › `TC-11 (AC-11): card info is always visible on touch screens`; `src/components/Portfolio.test.tsx` › `TC-11 (AC-11): each card has its title, style and "Request Similar Style" button, revealed on hover/focus`
- **Status:** Pass

### TC-12: "Request Similar Style" scrolls and preselects the mapped style
- **Acceptance criterion:** AC-12
- **Priority:** high
- **Type:** functional
- **Preconditions:** page loaded.
- **Test data:** Fine Line→Fine Line, Black & Grey→Black & Grey, Botanical & Floral→Botanical / Floral, Traditional & Bold→Traditional / Bold, Cover-Ups→Cover-Up.
- **Steps:**
  1. Select the category filter.
  2. Hover the first card and click "Request Similar Style".
  3. Read the Tattoo Style select and the form heading position.
- **Expected result:** Tattoo Style equals the mapped value and the form heading is below the sticky navbar.
- **Automated by:** `e2e/site.spec.ts` › `TC-12 (AC-12): "<filter>" card preselects "<style>"` (5 cases)
- **Status:** Pass

### TC-13: lightbox content, focus and scroll lock
- **Acceptance criterion:** AC-13
- **Priority:** high
- **Type:** functional, accessibility
- **Preconditions:** page loaded; card images visible.
- **Test data:** first card ("Micro-Fine Line Botanical Forearm").
- **Steps:**
  1. Click the card image.
  2. Read the dialog role, name, title, style, session time and active element.
  3. Read `document.body.style.overflow`.
- **Expected result:** A modal dialog named after the piece shows title, style and "Session time: …"; focus is inside the dialog; page scroll is locked.
- **Automated by:** `e2e/site.spec.ts` › `TC-13 (AC-13): lightbox opens on a card and returns focus on close`; `src/components/Portfolio.test.tsx` › `TC-13 (AC-13): clicking a card opens a dialog with title, style and session time, focus inside`
- **Status:** Pass

### TC-14: lightbox closes in all three ways and returns focus
- **Acceptance criterion:** AC-14
- **Priority:** high
- **Type:** functional, accessibility
- **Preconditions:** lightbox opened from a known card.
- **Test data:** Escape, Close button, backdrop click.
- **Steps:**
  1. Open the lightbox.
  2. Close with each method in turn.
- **Expected result:** The dialog disappears and focus returns to the card button that opened it.
- **Automated by:** `src/components/Portfolio.test.tsx` › `TC-14 (AC-14): closes with Escape and returns focus to the card`; `src/components/Portfolio.test.tsx` › `TC-14 (AC-14): closes with close button and returns focus to the card`; `src/components/Portfolio.test.tsx` › `TC-14 (AC-14): closes when the backdrop is clicked`
- **Status:** Pass

### TC-15: lightbox navigation stays inside the active filter and wraps
- **Acceptance criterion:** AC-15
- **Priority:** medium
- **Type:** boundary
- **Preconditions:** Fine Line filter active (2 items).
- **Steps:**
  1. Open the last fine-line item.
  2. Press "Next piece"; press ArrowLeft; press ArrowRight.
- **Expected result:** Next from the last item shows the first fine-line item; ArrowLeft returns to the last; ArrowRight goes forward again. No other category is shown.
- **Automated by:** `src/components/Portfolio.test.tsx` › `TC-15 (AC-15): next from the last fine-line item wraps to the first, within the filter`; `e2e/site.spec.ts` › `TC-15 (AC-15): next wraps inside the active Fine Line filter`
- **Status:** Pass

### TC-16: focus trap in the lightbox
- **Acceptance criterion:** AC-16
- **Priority:** medium
- **Type:** accessibility
- **Preconditions:** lightbox open.
- **Steps:**
  1. Press Tab six times.
  2. Press Shift+Tab six times.
- **Expected result:** Focus cycles Previous → Next → Close and never leaves the dialog.
- **Automated by:** `src/components/Portfolio.test.tsx` › `TC-16 (AC-16): Tab and Shift+Tab keep focus inside the dialog`; `e2e/site.spec.ts` › `TC-16 (AC-16): Tab keeps focus inside the dialog`
- **Status:** Pass

## Pricing

### TC-17: pricing cards, badge and deposit notice
- **Acceptance criterion:** AC-17
- **Priority:** high
- **Type:** functional
- **Preconditions:** page loaded.
- **Steps:**
  1. Read the three card headings and prices in `#pricing`.
  2. Read the badge and the deposit notice.
- **Expected result:** Three cards with the Appendix A titles and prices; "MOST REQUESTED" shown once; a paragraph starting "Deposit Policy Notice:" is visible.
- **Automated by:** `e2e/site.spec.ts` › `TC-17 (AC-17): pricing cards, badge and deposit notice`
- **Status:** Pass

### TC-18: pricing buttons scroll and preselect the size
- **Acceptance criterion:** AC-18
- **Priority:** high
- **Type:** functional
- **Preconditions:** page loaded.
- **Test data:** Inquire Small Piece→Small (2–4"), Start Custom Project→Medium (4–6"), Book Full Session→Large (6"+ / Sleeve).
- **Steps:**
  1. Click each pricing button.
  2. Read the Approximate Size select and the form heading position.
- **Expected result:** The select holds the mapped size and the form heading is in view below the navbar.
- **Automated by:** `e2e/site.spec.ts` › `TC-18 (AC-18): "<button>" preselects <size>` (3 cases)
- **Status:** Pass

## Aftercare, reviews, FAQ

### TC-19: default aftercare tab
- **Acceptance criterion:** AC-19
- **Priority:** high
- **Type:** functional
- **Preconditions:** CareGuide rendered.
- **Steps:**
  1. Read both tab states and the panel contents.
- **Expected result:** "Before Your Session" has `aria-selected="true"`; its four items are listed.
- **Automated by:** `src/components/Sections.test.tsx` › `TC-19 (AC-19): "Before Your Session" is selected with its four items`
- **Status:** Pass

### TC-20: switching aftercare tabs by click and arrow key
- **Acceptance criterion:** AC-20
- **Priority:** high
- **Type:** functional, accessibility
- **Preconditions:** CareGuide rendered.
- **Steps:**
  1. Click "Healing & Aftercare".
  2. Read the selected tab, the panel items and the old items.
  3. Reload and press Right arrow with the first tab focused.
- **Expected result:** The second tab becomes selected with its four items and no "Before Your Session" items; arrow key moves selection and focus to tab two; no reload.
- **Automated by:** `src/components/Sections.test.tsx` › `TC-20 (AC-20): clicking "Healing & Aftercare" swaps the content`; `src/components/Sections.test.tsx` › `TC-20 (AC-20): Right arrow on the first tab selects the second`
- **Status:** Pass

### TC-21: three testimonials with one rating label each
- **Acceptance criterion:** AC-21
- **Priority:** medium
- **Type:** functional, accessibility
- **Preconditions:** Reviews rendered.
- **Steps:**
  1. Read each quote, name and city.
  2. Count images labelled "Rated 5 out of 5 stars".
- **Expected result:** The three Appendix A testimonials are shown and exactly three rating labels exist (one per card).
- **Automated by:** `src/components/Sections.test.tsx` › `TC-21 (AC-21): shows three testimonials, each with one star rating label`
- **Status:** Pass

### TC-22: FAQ starts closed
- **Acceptance criterion:** AC-22
- **Priority:** high
- **Type:** functional
- **Preconditions:** FAQ rendered.
- **Steps:**
  1. List the question buttons.
  2. Read `aria-expanded` and search for answers.
- **Expected result:** Five questions; all `aria-expanded="false"`; no answer text rendered.
- **Automated by:** `src/components/Sections.test.tsx` › `TC-22 (AC-22): all 5 questions visible, all answers hidden`
- **Status:** Pass

### TC-23: FAQ toggling with click, Enter and Space; several open
- **Acceptance criterion:** AC-23
- **Priority:** high
- **Type:** functional, accessibility
- **Preconditions:** FAQ rendered.
- **Steps:**
  1. Click question 1.
  2. Focus question 2 and press Enter.
  3. Press Space on question 2.
  4. Click question 1 again.
- **Expected result:** Question 1 opens; Enter opens question 2 while question 1 stays open; Space closes question 2; clicking question 1 hides its answer.
- **Automated by:** `src/components/Sections.test.tsx` › `TC-23 (AC-23): click, Enter and Space toggle answers; several can be open`
- **Status:** Pass

## Form

### TC-24: empty submit blocks sending and reports every required field
- **Acceptance criterion:** AC-24
- **Priority:** high
- **Type:** negative, accessibility
- **Preconditions:** Booking form rendered with a test endpoint; empty values.
- **Steps:**
  1. Click "SUBMIT TATTOO INQUIRY".
  2. Read each required field's `aria-invalid`, accessible description and the active element.
  3. Check that no request was sent.
- **Expected result:** No request; all seven required fields show the Appendix A error messages and `aria-invalid="true"`; focus is on Full Name.
- **Automated by:** `src/components/BookingForm.test.tsx` › `TC-24 (AC-24): empty submit shows required errors, marks fields invalid, focuses Full Name, sends nothing`; `src/lib/inquirySchema.test.ts` › `TC-24 (AC-24): reports every required field on an empty form`
- **Status:** Pass

### TC-25: full name length boundaries
- **Acceptance criterion:** AC-25
- **Priority:** high
- **Type:** boundary
- **Preconditions:** other fields valid.
- **Test data:** `"A"`, `"   "`, `" A "`, `"Jo"`, 80 characters, 81 characters.
- **Steps:**
  1. Parse the schema with each value.
- **Expected result:** 1-character/blank values fail with "Please enter your full name."; 2 and 80 characters pass; 81 fails.
- **Automated by:** `src/lib/inquirySchema.test.ts` › `TC-25 (AC-25): rejects full name "A"`; `... › TC-25 (AC-25): rejects full name "   "`; `... › TC-25 (AC-25): rejects full name " A "`; `... › TC-44 (FR-13): enforces the 2–80 character boundaries for name and placement`
- **Status:** Pass

### TC-26: email format validation
- **Acceptance criterion:** AC-26
- **Priority:** high
- **Type:** negative, boundary
- **Preconditions:** other fields valid.
- **Test data:** `joy@`, `joy.com`, `` (empty), `joy@example.com`.
- **Steps:**
  1. Parse the schema with each email.
- **Expected result:** First three fail with "Please enter a valid email address."; `joy@example.com` passes.
- **Automated by:** `src/lib/inquirySchema.test.ts` › `TC-26 (AC-26): rejects email "joy@"`, `... "joy.com"`, `... ""`; `TC-26 (AC-26): accepts joy@example.com`
- **Status:** Pass

### TC-27: description minimum and counter limit
- **Acceptance criterion:** AC-27
- **Priority:** high
- **Type:** boundary
- **Preconditions:** form rendered; other fields valid.
- **Test data:** 9 characters, 10 characters, 2001 typed characters.
- **Steps:**
  1. Submit with 9 characters; read the error.
  2. Submit with 10 characters; verify accepted.
  3. Type 2100 characters into the textarea; read the value and counter.
- **Expected result:** 9 → "Please describe your idea (at least 10 characters)."; 10 → accepted; the field holds 2000 characters and the counter reads "2000 / 2000".
- **Automated by:** `src/lib/inquirySchema.test.ts` › `TC-27 (AC-27): requires 10 to 2000 characters of description`; `src/components/BookingForm.test.tsx` › `TC-27 (AC-27): counter shows length and the textarea stops at 2000 characters`; `e2e/site.spec.ts` › `TC-27 (AC-27): the description stops at 2000 characters and the counter follows`
- **Status:** Pass

### TC-28: unchecked age confirmation
- **Acceptance criterion:** AC-28
- **Priority:** high
- **Type:** negative
- **Preconditions:** all required fields valid, age unchecked.
- **Steps:**
  1. Submit.
- **Expected result:** "You must be 18 or older to book." is shown; no request is sent.
- **Automated by:** `src/components/BookingForm.test.tsx` › `TC-28 (AC-28): unchecked age box blocks sending`; `src/lib/inquirySchema.test.ts` › `TC-28 (AC-28): requires the age confirmation`
- **Status:** Pass

### TC-29: up to three reference images, fourth rejected
- **Acceptance criterion:** AC-29
- **Priority:** high
- **Type:** boundary
- **Preconditions:** form rendered; empty file list.
- **Test data:** `a.png`, `b.jpg`, `c.png` (valid), `d.png` (valid, fourth).
- **Steps:**
  1. Select the three valid files through the file input.
  2. Select `d.png`.
- **Expected result:** The three names are listed; `d.png` is rejected with a message naming it; the three remain listed.
- **Automated by:** `src/components/BookingForm.test.tsx` › `TC-29 (AC-29): lists 3 images, rejects a 4th, and Remove frees a slot`; `src/lib/inquirySchema.test.ts` › `TC-29 (AC-29): accepts up to 3 images and rejects a 4th, keeping the 3`; `e2e/site.spec.ts` › `TC-29 (AC-29): lists three images and rejects a fourth`
- **Status:** Pass

### TC-30: wrong type and oversize files rejected
- **Acceptance criterion:** AC-30
- **Priority:** high
- **Type:** negative, boundary
- **Preconditions:** form rendered.
- **Test data:** `anim.gif` (`image/gif`), `doc.pdf` (`application/pdf`), `big.jpg` (`image/jpeg`, 6 MB).
- **Steps:**
  1. Select each file (bypassing the picker filter where needed).
- **Expected result:** Each is rejected with a message naming the file and the reason (PNG/JPG only, or larger than 5 MB); none is listed.
- **Automated by:** `src/components/BookingForm.test.tsx` › `TC-30 (AC-30): rejects wrong type and oversize files with the file name and reason`; `src/lib/inquirySchema.test.ts` › `TC-30 (AC-30): rejects anim.gif by type`, `... doc.pdf by type`, `... a 6 MB JPG by size`; `e2e/site.spec.ts` › `TC-30 (AC-30): rejects a GIF and an oversize JPG with name and reason`
- **Status:** Pass

### TC-31: removing a listed image frees a slot
- **Acceptance criterion:** AC-31
- **Priority:** medium
- **Type:** functional
- **Preconditions:** three images listed.
- **Steps:**
  1. Click "Remove b.jpg".
  2. Add `d.png`.
- **Expected result:** `b.jpg` disappears; `d.png` can be added.
- **Automated by:** `src/components/BookingForm.test.tsx` › `TC-29 (AC-29): lists 3 images, rejects a 4th, and Remove frees a slot`
- **Status:** Pass

### TC-32: successful submit sends one multipart request and shows success
- **Acceptance criterion:** AC-32
- **Priority:** high
- **Type:** functional
- **Preconditions:** valid required fields filled, one image attached, endpoint intercepted with a delayed 2xx.
- **Steps:**
  1. Click submit.
  2. Read the button label/disabled state.
  3. Wait for the success message; read the active element.
  4. Count requests and inspect the content type and form fields.
- **Expected result:** Button reads "SENDING…" and is disabled; exactly one `multipart/form-data` request contains the filled values and the image; the success copy replaces the form and has focus.
- **Automated by:** `e2e/site.spec.ts` › `TC-32 (AC-32): valid form posts one multipart request and shows the success message`; `src/components/BookingForm.test.tsx` › `TC-32 (AC-32): sends one multipart request, shows SENDING…, then focuses the success message`; `src/lib/submitInquiry.test.ts` › `TC-32 (AC-32): includes filled fields and images, and skips empty optional fields`
- **Status:** Pass (flaky e2e, #1)

### TC-33: 4xx/5xx and network failure keep data and allow retry
- **Acceptance criterion:** AC-33
- **Priority:** high
- **Type:** negative
- **Preconditions:** valid form with one image; endpoint intercepted to answer 500 or fail the network.
- **Steps:**
  1. Submit.
  2. Read the alert, each field value and the image list.
  3. Submit again with the endpoint answering 200.
- **Expected result:** The Appendix A error is in a `role="alert"` region; every value and the image stay; the button is enabled again; the retry succeeds and shows the success message.
- **Automated by:** `src/components/BookingForm.test.tsx` › `TC-33 (AC-33): on a 500 answer keeps values and shows the error alert`; `... on a network failure keeps values and shows the error alert`; `... retrying after a failure sends a second request and shows success`; `e2e/site.spec.ts` › `TC-33 (AC-33): a server error keeps every value and a retry succeeds`
- **Status:** Pass

### TC-34: no endpoint configured behaves like a failure
- **Acceptance criterion:** AC-34
- **Priority:** high
- **Type:** negative
- **Preconditions:** `VITE_INQUIRY_ENDPOINT` empty; valid form.
- **Steps:**
  1. Submit.
  2. Read the alert and console.
- **Expected result:** The error alert is shown, no success message appears, no request is made, and a console warning is logged.
- **Automated by:** `src/components/BookingForm.test.tsx` › `TC-34 (AC-34): without an endpoint shows the error and warns`; `src/lib/submitInquiry.test.ts` › `TC-34 (AC-34): without an endpoint it fails, warns and sends nothing`
- **Status:** Pass

### TC-35: every control labelled and keyboard operable
- **Acceptance criterion:** AC-35
- **Priority:** high
- **Type:** accessibility
- **Preconditions:** form rendered.
- **Steps:**
  1. List every control by its visible label.
  2. Focus Full Name and press Tab until the submit button is reached.
  3. Confirm each control receives focus in order, including the hidden file input.
- **Expected result:** Ten controls, each with a visible label; keyboard focus order Full Name → Email → Social → Style → Placement → Size → Budget → Reference Images → Description → Age → Submit; the file input is reachable.
- **Automated by:** `src/components/BookingForm.test.tsx` › `TC-35 (AC-35): every control has a label`; `e2e/site.spec.ts` › `TC-35 (AC-35): every form control is in the keyboard tab order`
- **Status:** Pass

## Footer, SEO, quality

### TC-36: footer content, links and year
- **Acceptance criterion:** AC-36
- **Priority:** high
- **Type:** functional
- **Preconditions:** page loaded.
- **Steps:**
  1. Read the column headings and hours in the footer.
  2. Inspect the Instagram, Facebook and Google Maps links.
  3. Read the copyright line; click "Pricing & Session Guide".
- **Expected result:** The three headings and hours from Appendix A are shown; the three social links have `target="_blank"`; the copyright shows the current year; the quick link scrolls to pricing.
- **Automated by:** `e2e/site.spec.ts` › `TC-36 (AC-36): footer columns, external links and current year`
- **Status:** Pass

### TC-37: built page SEO and JSON-LD
- **Acceptance criterion:** AC-37
- **Priority:** high
- **Type:** functional
- **Preconditions:** `dist/index.html` built.
- **Steps:**
  1. Read `dist/index.html` for `lang="en"`.
  2. Read the title, meta description and Open Graph tags from the served page.
  3. Parse the single `application/ld+json` script.
- **Expected result:** Title and description per FR-17; four OG tags; one JSON-LD object with `@type` "TattooParlor", the street address, opens "11:00" and the five area-served cities.
- **Automated by:** `e2e/site.spec.ts` › `TC-37 (AC-37): built index.html has SEO tags and TattooParlor JSON-LD`
- **Status:** Pass

### TC-38: reduced motion
- **Acceptance criterion:** AC-38
- **Priority:** medium
- **Type:** functional, accessibility
- **Preconditions:** context with `reducedMotion: 'reduce'`.
- **Steps:**
  1. Read the computed `scroll-behavior` of `html`.
  2. Read a section container's computed opacity immediately (no scrolling).
  3. Open the lightbox; read the backdrop opacity immediately.
- **Expected result:** `scroll-behavior: auto`; sections are fully opaque without animation; the backdrop is opaque immediately (no fade).
- **Automated by:** `e2e/site.spec.ts` › `TC-38 (AC-38): nav, sections and lightbox happen without animation`
- **Status:** Pass

### TC-39: axe scan on desktop and mobile
- **Acceptance criterion:** AC-39
- **Priority:** high
- **Type:** accessibility
- **Preconditions:** both Playwright projects; reduced motion forced so all sections are rendered.
- **Steps:**
  1. Run axe on `/`.
  2. Filter violations with impact serious or critical.
- **Expected result:** No serious or critical violations on either project (colour contrast included).
- **Automated by:** `e2e/site.spec.ts` › `TC-39 (AC-39): no serious or critical axe violations` (desktop + mobile)
- **Status:** Pass

### TC-40: lint, unit tests, build and e2e
- **Acceptance criterion:** AC-40
- **Priority:** high
- **Type:** functional (tooling)
- **Preconditions:** clean checkout of the branch.
- **Steps:**
  1. `npm run lint`
  2. `npm test`
  3. `npm run build`
  4. `npm run test:e2e`
- **Expected result:** All four commands exit 0; TypeScript reports no errors during the build; CI runs the same four steps.
- **Automated by:** `.github/workflows/ci.yml` (manual run for this report)
- **Status:** Pass

## Exploration test cases

### TC-41: reference images can be dropped on the drop zone
- **Acceptance criterion:** FR-14 (exploration)
- **Priority:** medium
- **Type:** functional
- **Preconditions:** form rendered.
- **Test data:** drop `drop.png` (valid) and `drop.gif` (invalid) together.
- **Steps:**
  1. Dispatch a drop event with both files on the drop zone.
- **Expected result:** `drop.png` is listed; `drop.gif` is rejected with a message naming it and the type; the accepted file stays.
- **Automated by:** `e2e/site.spec.ts` › `TC-41 (FR-14): dropping images on the drop zone adds valid files and rejects invalid ones`; `src/components/BookingForm.test.tsx` › `TC-41 (FR-14): dropping files on the drop zone adds them`
- **Status:** Pass

### TC-42: double click sends one request only
- **Acceptance criterion:** FR-15 (exploration)
- **Priority:** medium
- **Type:** boundary
- **Preconditions:** valid form; endpoint intercepted with a delayed 2xx.
- **Steps:**
  1. Double-click the submit button.
  2. Count requests.
- **Expected result:** Exactly one request; the button is disabled while sending.
- **Automated by:** `e2e/site.spec.ts` › `TC-42 (FR-15): double-clicking submit sends exactly one request`; `src/components/BookingForm.test.tsx` › `TC-32 (AC-32): sends one multipart request, shows SENDING…, then focuses the success message`
- **Status:** Pass

### TC-43: special characters and emoji survive submission safely
- **Acceptance criterion:** FR-13 (exploration)
- **Priority:** medium
- **Type:** security
- **Preconditions:** valid form.
- **Test data:** full name `Camille <script>alert(1)</script> 🎨`, description `A tiny moon, Saturdays. <b>bold</b>`.
- **Steps:**
  1. Build the FormData and submit to an intercepted endpoint.
  2. Check the page after the success message for an injected `<script>` element.
- **Expected result:** Values are sent as plain form data (no escaping needed at rest); React renders them as text; no script element is injected and no alert runs.
- **Automated by:** `src/lib/submitInquiry.test.ts` › `TC-43 (FR-13): keeps special characters and emoji in the submitted data`
- **Status:** Pass

### TC-44: length boundaries for the text fields
- **Acceptance criterion:** FR-13 (exploration)
- **Priority:** medium
- **Type:** boundary
- **Preconditions:** schema imported in a unit test.
- **Test data:** name/placement 2, 80, 81 characters; social contact 60 and 61 characters.
- **Steps:**
  1. Parse the schema at each boundary.
- **Expected result:** 2 and 80 pass, 81 fails; social 60 passes, 61 fails; errors use the Appendix A wording.
- **Automated by:** `src/lib/inquirySchema.test.ts` › `TC-44 (FR-13): enforces the 2–80 character boundaries for name and placement`; `... TC-44 (FR-13): limits social contact to 60 characters`
- **Status:** Pass

### TC-45: rapid filter switching leaves a consistent grid
- **Acceptance criterion:** FR-5 (exploration)
- **Priority:** low
- **Type:** boundary
- **Preconditions:** Portfolio rendered.
- **Steps:**
  1. Click all six filters in quick succession, ending on Fine Line.
  2. Read the pressed state and card count.
- **Expected result:** Only Fine Line is pressed and only its two cards are shown.
- **Automated by:** `src/components/Portfolio.test.tsx` › `TC-45 (FR-5): rapid filter switching ends on the last selected filter`
- **Status:** Pass

### TC-46: validation runs on change only for touched fields
- **Acceptance criterion:** FR-13 (exploration)
- **Priority:** medium
- **Type:** functional
- **Preconditions:** form submitted once, Full Name invalid.
- **Steps:**
  1. Type a valid name.
  2. Read the error.
- **Expected result:** The Full Name error disappears as soon as the field becomes valid; untouched fields keep their errors.
- **Automated by:** `src/components/BookingForm.test.tsx` › `TC-46 (FR-13): re-validates touched fields on change after a submit`
- **Status:** Pass

### TC-47: every aria-controls IDREF resolves to an element in the DOM
- **Acceptance criterion:** FR-2 and FR-10 (exploration)
- **Priority:** medium
- **Type:** accessibility
- **Preconditions:** page loaded at 375 px and at 1440 px.
- **Steps:**
  1. Collect every element with `aria-controls`.
  2. For each value, check `document.getElementById(value) !== null`.
  3. Repeat with the mobile menu open and with the second aftercare tab selected.
- **Expected result:** Every `aria-controls` value resolves to an existing element in both states.
- **Automated by:** no automated test yet (see issue #2); verified by DOM inspection
- **Status:** Fail (#2)

### TC-48: primary button hover uses the Appendix C hover token
- **Acceptance criterion:** Appendix C, FR-18 (exploration)
- **Priority:** low
- **Type:** functional (visual)
- **Preconditions:** page loaded at 1440 px.
- **Steps:**
  1. Hover a `btnPrimary` button (navbar "BOOK A CONSULTATION").
  2. Read the computed background colour.
- **Expected result:** `#B45309` (`rgb(180, 83, 9)`, `accent-gold-hover` per Appendix C).
- **Automated by:** no automated test yet (see issue #3); verified with computed styles
- **Status:** Fail (#3)

## Not covered

- **Visual fidelity against `docs/design/homepage-mockup.png`** (spacing, exact type sizes, colours) is not asserted automatically; screenshots would be brittle at this stage. Checked visually on desktop 1440×900 and mobile 375×812; layout order, colours and copy match the spec.
- **Real file picker dialogs and a real drag source** cannot be automated in Playwright; files are set with `setInputFiles` and a synthetic `DataTransfer` drop event instead.
- **The real external form service** is not called; all requests are intercepted. The production endpoint and any server-side file validation are out of scope for this MVP (see spec assumption 2).
- **Email/SMS deliverability and response time** are outside the page.
- **Browsers other than Chromium** (Firefox, Safari/iOS) are not in the Playwright projects; the spec only names Chromium desktop and mobile.
- **The `dist/index.html` build artefact in CI** is verified by the e2e project; no separate deployment check exists (deploy is out of scope).
- **TC-47 and TC-48 are not yet automated.** Both are minor issues found during exploration and code review (#2, #3); adding a red test to the suite would hide a real failure, so the checks stay manual until the fixes land and regression tests can be added with them.
