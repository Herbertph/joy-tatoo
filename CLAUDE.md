# joy-tatoo

Website for Joy Tattoo, a boutique tattoo studio in Downtown Moncton, NB: one page that shows the studio's work and prices and collects consultation and quote requests.

Built by a multi-agent team: analyst (spec) → senior developer → front-end developer → senior QA → reviewer → pull request. A human reviews and merges every PR.

## Stack

- Vite + React 18 + TypeScript (strict), Tailwind CSS 3.4 (design tokens in `tailwind.config.ts`)
- lucide-react icons, framer-motion (small animations, honours reduced motion), react-hook-form + zod
- Fonts self-hosted with @fontsource (Cormorant Garamond, Montserrat, Inter)
- Vitest + Testing Library (jsdom) for unit/component tests; Playwright + @axe-core/playwright for e2e
- CI: `.github/workflows/ci.yml` (lint, unit, build, e2e)

## Commands

- Install: `npm ci` (first time also `npx playwright install chromium`)
- Dev server: `npm run dev` (port 5173)
- Build: `npm run build` (tsc + vite build)
- Lint: `npm run lint`
- Unit tests: `npm test`
- E2E: `npm run test:e2e` (builds and serves preview on port 5180 with `VITE_INQUIRY_ENDPOINT=https://inquiry.test/submit`; desktop 1440px and mobile 375px projects). Never use port 4545.
- Env: `VITE_INQUIRY_ENDPOINT` is the form service URL that receives inquiries as `multipart/form-data`. Without it the form shows an error.

## Structure

- `src/data/tattooData.ts`: all site copy, portfolio items and image paths (`placeholder` flag)
- `src/lib/`: pure logic with unit tests (`inquirySchema`, `submitInquiry`, `portfolio`, `mapsUrl`)
- `src/components/`: one component per section, shared bits in `ui.tsx`, form preselection in `BookingContext.tsx`; component tests next to them
- `e2e/`: Playwright tests
- `public/images/`: placeholder images and `CREDITS.md`
- `index.html`: SEO meta, Open Graph and TattooParlor JSON-LD

- `docs/specs/`: feature specs written by the requirements analyst
- `docs/test-cases/`: test cases (TC-n, with steps and expected results) written by the tester
- `docs/test-reports/`: test reports written by the tester
- Bugs found in testing are filed as GitHub issues labeled `bug` and `severity: *`. Fix commits reference the issue (`fix: ... (#12)`), and PRs close them with `Fixes #12`.

## Conventions

- Everything in the repository is written in English: code, comments, docs, commit messages, PR descriptions.
- Keep business logic in pure, testable functions, separate from UI code.
- Never render user input as HTML.
- Prefer accessible markup (labels, roles, `aria-*`). End-to-end tests locate elements with `getByRole`, `getByLabel` and `getByText` where possible.
- Name tests after behavior. Acceptance tests start with their criterion ID, for example `AC-2: rejects a blank title`.
- Commits follow Conventional Commits: `feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `chore:`.
- Feature branches are named `feature/<slug>`, or keep the branch Claude Code created for a worktree session. Never commit to `main`.

## Definition of done

- Every acceptance criterion in the spec is covered by at least one test.
- Build, unit tests and end-to-end tests all pass.
- No unrelated changes in the diff.
