# IELTSora Admin Dashboard

The content and platform management app for IELTSora, an IELTS preparation platform. It is a standalone React + Vite app, completely separate from the student website (`../IELTSora`), with its own dependencies, routing, layout, components and mock data.

> **Demo only.** There is no backend. Every piece of data is mock data held in this browser's LocalStorage. Login is **demonstration authentication** checked in the browser. It is not production security.

## Run it

```bash
npm install
npm run dev        # http://localhost:5174
npm run build      # production build in dist/
npm run preview    # serve the build at http://localhost:4174
```

### Demo credentials

| Email | Password |
|---|---|
| `admin@example.com` | `admin123` |

The login page has a **Fill demo credentials** button. Every admin route is protected by a frontend route guard (`src/routes/ProtectedRoute.jsx`).

## Features

| Area | Route | What you can do |
|---|---|---|
| Overview | `/` | KPIs (students, active, daily tasks, completed tasks, Cambridge sessions, mock tests), DAU, student growth, popular modules, completion by phase, recent registrations and activity |
| Students | `/users`, `/users/:id` | Search, filter (status/phase/country), sort, paginate, export CSV, add/edit/delete students, activate or deactivate with confirmation, and view a profile with module performance, score trend and paginated practice history |
| 60-Day Plan | `/study-plan` | All 60 days in grid or table view, filters, per-day and per-phase publish/unpublish, student preview, reset to default, content export/import |
| Day editor | `/study-plan/:day` | Edit title, phase, objectives and publish state; manage the day’s 20 vocabulary words (theme, word, part of speech, meaning, example; add/edit/reorder/delete; reset to default — a day can only be published with exactly 20 complete, unique words); create, edit, delete and reorder tasks (module, Cambridge book/test/part or full test, steps, duration, difficulty); four-module check (a published day must have all four); preview; previous/next day with an unsaved-changes guard |
| Cambridge Library | `/cambridge` | Books 10–21: add/edit/delete books, publish books and tests |
| Test editor | `/cambridge/:book/test/:n` | Reading passages 1–3, Listening sections 1–4, Writing Task 1/2 and Speaking Parts 1–3; publish toggle; student-style preview; per-part question counts that link into the bank |
| Question Bank | `/questions` | Create, edit, duplicate and delete questions with validation. Selection cascades module → book → test → part → type. Covers all 12 Reading types plus Form Completion and Map Labelling for Listening, with custom or fixed options, answer key, explanation and marks. Filters live in the URL (`?module=&book=&test=&part=&type=`) |
| Mock Tests | `/mock-tests` | Create, edit, duplicate and delete tests; choose modules and per-module durations; pick questions from the bank; scoring by band map or by marks with a pass mark; a timed, interactive preview that scores answers; publish toggle |
| Modules | `/modules` | Visibility, description, student instructions and practice categories for Reading, Listening, Writing and Speaking |
| Homepage | `/homepage` | Hero, CTAs, features, testimonials, FAQs and footer (add/remove/reorder) with a live preview |
| Analytics | `/analytics` | 7/30/90-day range: DAU, student growth, task completion, Reading and Listening score trends, module popularity, average scores, study-plan completion by day and by phase, CSV export |
| Settings | `/settings` | Admin profile, platform defaults (including the default target band), study plan rules, default task durations, mock notifications, content export/import, reset all data |

## Data storage

All data lives in LocalStorage under the `ieltsora_admin_` prefix. Each store is seeded from `src/data/*` on first load:

| Key | Contents |
|---|---|
| `ieltsora_admin_session` | Demo login session |
| `ieltsora_admin_users` | 40 mock students with practice history |
| `ieltsora_admin_study_plan` | 60 days × 4 module tasks + 20 vocabulary words (older stored plans are migrated on read) |
| `ieltsora_admin_cambridge` | Books 10–21, Tests 1–4, all parts |
| `ieltsora_admin_questions` | Question bank |
| `ieltsora_admin_mock_tests` | Mock tests |
| `ieltsora_admin_modules` | Module configuration |
| `ieltsora_admin_homepage` | Public homepage content |
| `ieltsora_admin_settings` | Platform settings |

Pages read and write data only through `src/hooks/useLocalStorage.js` and `src/utils/storage.js`. To connect a real API later, replace those functions.

## Sending content to the student website

The admin app (port 5174) and the website (port 5173) run on different origins, so they **cannot** share LocalStorage. Nothing syncs automatically. To move content across:

1. In the admin app, click **Export content** (Study Plan, Homepage or Settings). This downloads `ieltsora-content-YYYY-MM-DD.json`.
2. In the student website, open **Settings → Content sync** and import that file.

File format (`format: "ieltsora-content-v1"`):

```jsonc
{
  "format": "ieltsora-content-v1",
  "exportedAt": "ISO date",
  "studyPlan": [{
    "day": 1, "title": "…", "phase": "Foundation | Skill Development | Exam Preparation",
    "objectives": ["…"], "published": true,
    "tasks": [{
      "id": "d1-reading", "module": "reading | listening | writing | speaking", "title": "…",
      "source": { "book": 10, "test": 1, "part": 1 /* or "full" */ } /* or null */,
      "steps": ["…"], "duration": 45, "difficulty": "Easy | Medium | Hard",
      "practice": { } /* optional, kept as-is when present */
    }],
    "vocabulary": { "theme": "Education", "words": [{ "word": "curriculum", "pos": "noun | verb | adjective | adverb | phrase", "meaning": "…", "example": "…" }] } /* 20 words, or null */
  }],
  "homepage": { "heroTitle", "heroDescription", "primaryCta", "secondaryCta", "features", "testimonials", "faqs", "footer" },
  "settings": { "allowFutureDays": false }
}
```

The same file can be imported back into the admin app, and it is validated before anything is replaced.

## Project structure

```text
src/
├── components/
│   ├── analytics/   ChartCard, tooltip, legend, axis presets (grayscale Recharts)
│   ├── common/      PageHeader, StatCard, EmptyState, SearchInput, badges, DayPreview
│   ├── forms/       StudentForm, TaskForm, QuestionForm, ListEditor
│   ├── layout/      Sidebar
│   ├── tables/      Pagination, SortableHead
│   └── ui/          shadcn/ui-style primitives (0px radius, black & white)
├── data/            mock data generators (users, study plan, Cambridge, questions, tests…)
├── hooks/           useAuth (demo auth), useLocalStorage / useStore
├── layouts/         AdminLayout (desktop sidebar + mobile drawer)
├── pages/           one file per route
├── routes/          AdminRoutes, ProtectedRoute
└── utils/           storage, contentSync, constants, format, random
```

All passages, transcripts, prompts and questions are original demonstration content. None of it is copied from Cambridge IELTS books.
