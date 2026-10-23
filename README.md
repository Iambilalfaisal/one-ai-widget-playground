# one-ai-widget-playground

A demo website ("Acme Cloud") with the One-AI chat widget installed exactly as a customer would install it, plus QA tooling to test every widget feature end to end.

Built on the same stack as One-AI: **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4**.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Requires Node 20+. Production build: `npm run build && npm start`.

Optional: copy `.env.example` to `.env.local` to pre-fill a default Widget ID / environment.

## Testing the widget

1. Open **Test Console → Setup & controls**.
2. Keep the environment on **Standalone** (widget served by this site, API on Dev) or pick **Dev**/**Local**/**Custom**, paste the **Widget ID** from the One-AI dashboard (Widgets → your widget → Embed Code) and click **Initialize widget**.
3. The chat launcher now appears on every page. Work through **Test checklist**, marking each scenario Pass/Fail, then **Copy report** into the Jira ticket.
4. If the widget does not appear, run **Diagnostics**.

A configured link can be shared with testers: **Copy shareable link** produces `/console?env=dev&widgetId=…`.

### Allowed origins

The widget only works on origins listed in the widget's **Allowed origins** (dashboard → widget → Security). `localhost` on any port is always allowed. A deployed copy of this site must have its URL added there first (the backend caches the list for about a minute).

## What is in the site

| Area | Purpose |
|---|---|
| `/`, `/products`, `/products/[slug]`, `/pricing`, `/support` | Realistic pages to test launcher placement, navigation and **page-targeted greetings** (`/pricing`, `/products*`). |
| `/blog/scaling-with-confidence` | Deliberately long page for the **open-on-scroll** trigger. |
| `/console` | Environment (Standalone/Dev/Local/Custom), Widget ID, script source, simulated visitor language, draft-preview token, open/close/toggle, **offline simulation**, "new visitor" reset, live **event log** (widget API calls and chat → page messages). |
| `/console/checklist` | 36 guided scenarios with steps and expected results; progress saved in the browser; exports a text report. |
| `/console/diagnostics` | Checks the script, config endpoint (surfaces CORS / allowed-origin problems) and chat page; shows what the widget is configured to do. |
| `/console/snippets` | The HTML / React / Vue / npm embed code, filled with the current settings. |

## The widget code (all in this repo)

Both halves of the widget run from this repo, copied unchanged from `One_AI_UI`:

| Piece | Where | Served at |
|---|---|---|
| Loader (launcher, triggers, sessions, API calls) | `public/widget.js` | `/widget.js` |
| Chat window (messages, lead form, attachments, feedback, markdown) | `app/(embed)/embed/[widgetId]/page.tsx` + `vendor/one-ai-ui/` | `/embed/<widgetId>` (the iframe) |

The default **Standalone** environment uses exactly this: the loader and chat window come from this site and only the backend API is on Dev (`one-ai-api-dev.aiimone.com`). The **Dev** and **Local** environments instead load everything from the One-AI app at that URL, which is useful for comparing against what is actually deployed. The backend (`One_AI_API`) is a separate service and is not part of this repo.

`vendor/one-ai-ui/` mirrors the files the chat window imports (components, styles helpers, types, design tokens). They are generated: **do not edit them by hand.** Change the widget in `One_AI_UI`, then:

```bash
npm run widget:sync                     # expects ../One_AI_UI
node scripts/sync-widget.mjs <path-to-One_AI_UI>
```

The sync copies 11 files, rewrites their `@/…` imports to `@/vendor/one-ai-ui/…`, and stamps each with the source branch and commit.

## Project structure

```
app/(site)/           demo website + /console/* (header, footer, widget loader)
app/(embed)/          the chat window iframe, /embed/[widgetId] (vendored, bare layout)
components/
  layout/             header, footer, page hero, QA note callout
  console/            config, controls, event log, checklist, diagnostics, snippets
  widget/             WidgetProvider (loads widget.js, init/destroy, event capture)
  ui/                 small design-system primitives
lib/                  config + environments, checklist data, simulators, site copy
public/widget.js      the widget loader (vendored)
vendor/one-ai-ui/     files the chat window imports (vendored)
scripts/              widget:sync
```

`WidgetProvider` (in `app/(site)/layout.tsx`) owns the widget lifecycle. By default it re-installs the widget on each client-side navigation, which mimics a multi-page site and lets page-targeted greetings re-resolve; turn this off in the console to keep one instance alive across pages.
