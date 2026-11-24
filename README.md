# PowerMatch — Company Onboarding

Next.js (App Router, React 19, TypeScript) version of the "Company Onboarding link 2.3" designs, with desktop and mobile layouts.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. It redirects to `/onboarding/role`.

## Flow (8 steps)

| # | Route | Screen |
|---|-------|--------|
| 1 | `/onboarding/role` | Choose a role, plus the "How it works" video popup |
| 2 | `/onboarding/location` | Address search, "Use my location", travel-time slider |
| 3 | `/onboarding/tasks` | Pick 1–3 tasks |
| 4 | `/onboarding/requirements` | Driving license, plus company car when a license is required |
| 5 | `/onboarding/experience` | Years of experience, hourly salary, "Calculate salary" suggestion, too-low error |
| 6 | `/onboarding/contact` | Company (pick from list or add new), email, phone |
| 7 | `/onboarding/confirm` | 4-digit email code, resend timer, incorrect-code state |
| 8 | `/onboarding/review` | Summary with Edit links, "Email confirmed" toast, Get Matches |
| – | `/onboarding/done` | Confirmation |

Every "What is this?" link opens its help popup. "Need help" (mobile) opens chat, FAQ and About.
The flow is saved in `sessionStorage`, so a refresh keeps your progress. Opening a later step directly
sends you back to the first step that isn't finished. "Edit" on the review page returns you to review after Continue.

## Where things live

- `lib/steps.ts`: step order, titles, breadcrumb labels
- `lib/data.ts`: roles, tasks, addresses, companies, help texts, FAQ
- `lib/store.tsx`: flow state, persistence, per-step validation
- `lib/api.ts`: **mock backend**: email code, salary suggestion, submit. Replace with real API calls.
- `components/Shell.tsx`: page chrome (desktop hero, breadcrumbs, sidebar; mobile top bar, progress, sticky Continue)
- `components/steps/*`: one component per step
- `public/roles/*.png`: role illustrations, cut from the design file

## Mocked behaviour

- Email verification code: **2536** (shown on the page as "Demo code").
- "Use my location" returns a fixed Copenhagen address. Wire up `navigator.geolocation` and a geocoding API.
- Address and company lists are static samples.
