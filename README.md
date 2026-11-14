# IELTSora Admin Dashboard

The content app for the IELTSora student website, an IELTS preparation platform. It is a standalone React + Vite app, completely separate from the student website (`../IELTSora`), with its own dependencies, routing, layout, components and mock data.

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

The admin only contains pages whose content reaches the student website.

| Area | Route | What you can do |
|---|---|---|
| 60-Day Plan | `/study-plan` (also `/`) | All 60 days in grid or table view, filters, per-day and per-phase publish/unpublish, student preview, reset to default, content export/import |
| Day editor | `/study-plan/:day` | Title, phase, objectives, publish state; the day's 20 vocabulary words; module tasks with their Cambridge book/test/part, steps, duration and difficulty; preview; previous/next day |
| Cambridge Practice | `/cambridge`, `/cambridge/:book/:test/:module/:part` | Upload Book 10–21 · Test 1–4 content in one format: Reading passages 1–3 and Listening sections 1–4 (text or audio link, transcript, question groups with answers), Writing tasks 1–2 (prompt, chart image link) and Speaking parts 1–3 (questions, cue card). Parts not uploaded keep the website’s built-in sample |
| Homepage | `/homepage` | Hero, CTAs, features, testimonials, FAQs and footer with a live preview |
| Settings | `/settings` | "Open all days" switch (sent to the website), default task durations, export/import, reset all data |

## Data storage

All data lives in LocalStorage under the `ieltsora_admin_` prefix. Each store is seeded from `src/data/*` on first load:

| Key | Contents |
|---|---|
| `ieltsora_admin_session` | Demo login session |
| `ieltsora_admin_study_plan` | 60 days × 4 module tasks + 20 vocabulary words (older stored plans are migrated on read) |
| `ieltsora_admin_cambridge_content` | Uploaded Cambridge parts (see `src/utils/cambridgeContent.js` for the format) |
| `ieltsora_admin_homepage` | Public homepage content |
| `ieltsora_admin_settings` | "Open all days" and default task durations |

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
  "cambridge": [{ "book": 21, "test": 1, "module": "reading | listening | writing | speaking", "part": 1, "content": { } }] /* optional; format in src/utils/cambridgeContent.js */,
  "homepage": { "heroTitle", "heroDescription", "primaryCta", "secondaryCta", "features", "testimonials", "faqs", "footer" },
  "settings": { "allowFutureDays": false }
}
```

The same file can be imported back into the admin app, and it is validated before anything is replaced.

## Project structure

```text
src/
├── components/
│   ├── common/      PageHeader, badges, DayPreview
│   ├── forms/       TaskForm, VocabularyEditor, ListEditor
│   ├── layout/      Sidebar
│   └── ui/          shadcn/ui-style primitives
├── data/            default study plan, homepage, settings, vocabulary
├── hooks/           useAuth (demo auth), useLocalStorage / useStore
├── layouts/         AdminLayout (desktop sidebar + mobile drawer)
├── pages/           one file per route
├── routes/          AdminRoutes, ProtectedRoute
└── utils/           storage, contentSync, constants, format, random
```

All passages, transcripts, prompts and questions are original demonstration content. None of it is copied from Cambridge IELTS books.
