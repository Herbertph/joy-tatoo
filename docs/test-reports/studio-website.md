# Test report: Joy Tattoo studio website (MVP)

- **Verdict:** PASS
- **Branch:** `feature/studio-website`
- **Code under test:** `0a8bd61` (feature code; the test cases, automation and this report are committed on top)
- **Spec:** `docs/specs/studio-website.md`
- **Test cases:** `docs/test-cases/studio-website.md`
- **Tester:** Senior QA (`found-by: tester-agent`)

## What ran

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | Pass, no warnings |
| Unit/component tests | `npm test` (7 files) | Pass: 70/70 |
| Type check + build | `npm run build` | Pass (no TypeScript errors) |
| E2E (Chromium 1440×900 + 375×812) | `npm run test:e2e` | Pass: 54 executed, 22 skipped by design, 0 failed |
| CI workflow | `.github/workflows/ci.yml` | Runs the same four checks (AC-40) |

E2E totals: 76 test definitions across the desktop and mobile projects; 22 are desktop-only and skip on mobile (`test.skip`), 54 executed. The same suite ran green twice after the test-case fixes (run 2 and the confirmation run).

## Traceability

Every acceptance criterion (AC-1 to AC-40) has at least one passing automated test case. The detailed AC → TC → automated test mapping, steps and expected results are in `docs/test-cases/studio-website.md`.

| Area | ACs | TCs | Result |
|---|---|---|---|
| Layout and navigation | AC-1 – AC-7 | TC-1 – TC-7 | All pass |
| Portfolio and lightbox | AC-8 – AC-16 | TC-8 – TC-16 | All pass |
| Pricing | AC-17 – AC-18 | TC-17 – TC-18 | All pass |
| Aftercare, reviews, FAQ | AC-19 – AC-23 | TC-19 – TC-23 | All pass |
| Form | AC-24 – AC-35 | TC-24 – TC-35 | All pass |
| Footer, SEO, quality | AC-36 – AC-40 | TC-36 – TC-40 | All pass |
| Exploration (outside ACs) | FR-2, FR-5, FR-13, FR-14, FR-15, FR-18, App. C | TC-41 – TC-48 | TC-41 – TC-46 pass; TC-47 (#2) and TC-48 (#3) fail |

No acceptance criterion is ambiguous or untestable. Two clarifications are noted under **Spec issues** below; neither blocks the feature.

## Issues opened

| Issue | Severity | Title |
|---|---|---|
| #1 | minor (flaky-test) | Mobile e2e scroll assertions fail intermittently in the parallel full run |
| #2 | minor | aria-controls points to elements that do not exist when the menu is closed or a tab is unselected |
| #3 | minor | Primary buttons hover to the glow gold instead of the defined hover token |

No critical or major issue is open. No issues existed before this run; all three are new and none duplicates another.

## Flaky tests

- **#1:** in the baseline full run, 2 of 56 executions failed on the mobile project: `TC-12 (AC-12): "Traditional & Bold" card preselects "Traditional / Bold"` and `TC-18 (AC-18): "Inquire Small Piece" preselects Small (2–4")`. Each failed in the shared `expectInViewBelowNavbar` helper after 5 s; the form value was already preselected. Both passed when re-run individually and passed in the next full run (0 of 54 executed). Observed failure rate ~3.6% of executions in that run. The tests are not wrong about the product: the scroll finishes slightly after the polling window under parallel load. Suggested fix: wait for the scroll to settle (or poll longer) instead of a fixed 5 s assertion window.

## Spec issues (clarifications, not blockers)

1. **FR-3 gradient mask:** the spec says the hero image has "a soft gradient mask on its left edge" without a viewport scope. The implementation applies the mask only at `lg` and up (where the image sits beside the text). This matches the desktop mock-up and the intent, but the wording could say "on desktop".
2. **FR-19 reduced motion and button hover:** the spec lists "button hover" among animations to turn off, while the implementation keeps the 200 ms colour transition on buttons (framer-motion animations are disabled, smooth scrolling is instant). Colour fades are not motion and do not trigger vestibular issues; if the literal reading is intended, the CSS `transition-colors` would need a reduced-motion override. Clarify in the spec rather than changing the code unasked.

## Code review (diff `main...HEAD`)

Reviewed with the `code-review-and-quality` skill; the change touches user input and an external service, so `security-and-hardening` was applied too.

**Correctness** — The implementation matches the spec: anchor/scroll-margin behaviour, portfolio filter and empty state, lightbox navigation within the active filter and the focus trap, WAI-ARIA tabs, FAQ accordion, all form rules and submit states, footer copy/year and SEO/JSON-LD. I also verified the risky paths in a real browser: empty submit focuses Full Name and lists all seven errors; a 500 answer keeps values and images and a retry succeeds; special characters and emoji are preserved and React renders them as text (no `<script>` injection); double-click sends one request; 2 000-character cap and the counter agree; drag and drop accepts PNG/JPG and rejects a GIF.

**Readability / architecture** — Clear component-per-section structure, all copy in one typed data file, pure logic in `src/lib` with its own tests, shared `Section`/`Stars`/scroll helper, and a small `BookingContext` for preselecting form values. No raw hex values in components; design tokens are used by name. No dead code found.

**Security** — No secrets, no `eval`/`dangerouslySetInnerHTML`, user text submitted as data and rendered through React escaping; external links use `target="_blank"` with `rel="noopener noreferrer"`; the Maps URL encodes the address. Client-side file type/size checks are a UX guard, not a security boundary — the external form service must re-validate uploads (already noted in spec assumption 2). No server-side storage of PII in this repo.

**Findings** — The two minor defects above (#2, #3). Non-blocking notes for the report only: `README.md` and `CLAUDE.md` still contain the Portuguese line "instrucoes na primeira msg", which breaks the repository's English-only convention; the mobile axe scan reports one **moderate** best-practice violation (`region`: the mobile top-bar links sit outside a landmark) — AC-39 only requires no serious/critical violations, so it passes; the submit fetch has no timeout, so a hung request would leave the button on "SENDING…" indefinitely (not required by the spec, worth a follow-up).

**Dependencies** — `npm audit` reports one high advisory: `zod < 4.6.6` (CVE-2023-54404, memory exhaustion when validating an unbounded array schema). This app's only zod schema is a flat object of bounded strings with no array fields, so the vulnerable code path is not reachable. Deferring the breaking upgrade to zod 4; re-check when `@hookform/resolvers` compatibility is confirmed. No other high or critical findings.

## Residual risks

- Real form delivery, server-side validation and file storage are outside the page and were not exercised; requests are intercepted in tests.
- Only Chromium was tested (desktop and mobile emulation); Firefox/Safari and a physical iOS device are not in the Playwright projects.
- Visual fidelity against `docs/design/homepage-mockup.png` was checked by eye, not with screenshot diffing.

## Handoff

The feature passes QA. The three open issues are minor (one test flake, two accessibility/design-token nits) and can be scheduled as backlog; none blocks the next review step.
