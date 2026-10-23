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
2. Choose the environment (**Dev** points at `one-ai-api-dev.aiimone.com` / `one-ai-dev.aiimone.com`), paste the **Widget ID** from the One-AI dashboard (Widgets → your widget → Embed Code) and click **Initialize widget**.
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
| `/console` | Environment, Widget ID, script source, simulated visitor language, draft-preview token, open/close/toggle, **offline simulation**, "new visitor" reset, live **event log** (widget API calls and chat → page messages). |
| `/console/checklist` | 36 guided scenarios with steps and expected results; progress saved in the browser; exports a text report. |
| `/console/diagnostics` | Checks the script, config endpoint (surfaces CORS / allowed-origin problems) and chat page; shows what the widget is configured to do. |
| `/console/snippets` | The HTML / React / Vue / npm embed code, filled with the current settings. |

## The widget code

`public/widget.js` is a copy of the canonical loader from `One_AI_UI/public/widget.js`, served locally so the site is self-contained. In the console, **Widget script → Hosted** loads it from the Chat URL instead, to verify what is actually deployed.

Re-sync after the loader changes:

```bash
npm run widget:sync                     # expects ../One_AI_UI
node scripts/sync-widget.mjs <path-to-One_AI_UI>
```

The chat window itself (the iframe) is always served by the One-AI app at the Chat URL; this repo does not duplicate it.

## Project structure

```
app/                  routes (site pages + /console/*)
components/
  layout/             header, footer, page hero, QA note callout
  console/            config, controls, event log, checklist, diagnostics, snippets
  widget/             WidgetProvider (loads widget.js, init/destroy, event capture)
  ui/                 small design-system primitives
lib/                  config + environments, checklist data, simulators, site copy
public/widget.js      the widget loader
scripts/              widget:sync
```

`WidgetProvider` (in the root layout) owns the widget lifecycle. By default it re-installs the widget on each client-side navigation, which mimics a multi-page site and lets page-targeted greetings re-resolve; turn this off in the console to keep one instance alive across pages.
