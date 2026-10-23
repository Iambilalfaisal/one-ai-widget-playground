// Copies the One-AI widget code from the One_AI_UI repo into this repo, unchanged
// except for two mechanical edits applied to TypeScript/TSX files:
//   1. imports of '@/…' are re-pointed at '@/vendor/one-ai-ui/…' so the copied
//      files never collide with this playground's own components;
//   2. a "do not edit" banner is added at the top.
//
// Usage:  npm run widget:sync                         (expects ../One_AI_UI)
//         node scripts/sync-widget.mjs <path-to-One_AI_UI>
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const uiRepo = resolve(root, process.argv[2] ?? '../One_AI_UI')
const VENDOR = 'vendor/one-ai-ui'

/** [path in One_AI_UI, path in this repo] */
const FILES = [
  // Host-page loader (served at /widget.js) -- copied byte for byte.
  ['public/widget.js', 'public/widget.js'],
  // Chat window served in the iframe at /embed/[widgetId].
  ['app/(embed)/embed/[widgetId]/page.tsx', 'app/(embed)/embed/[widgetId]/page.tsx'],
  // What the chat window imports.
  ['components/widget/WidgetRichContent.tsx', `${VENDOR}/components/widget/WidgetRichContent.tsx`],
  ['components/widget/WidgetMarkdown.tsx', `${VENDOR}/components/widget/WidgetMarkdown.tsx`],
  ['components/ui/app-image.tsx', `${VENDOR}/components/ui/app-image.tsx`],
  ['components/ui/badge.tsx', `${VENDOR}/components/ui/badge.tsx`],
  ['lib/widget-styles.ts', `${VENDOR}/lib/widget-styles.ts`],
  ['lib/utils.ts', `${VENDOR}/lib/utils.ts`],
  ['lib/config.ts', `${VENDOR}/lib/config.ts`],
  ['types/index.ts', `${VENDOR}/types/index.ts`],
  ['styles/tokens.css', `${VENDOR}/styles/tokens.css`],
]

if (!existsSync(resolve(uiRepo, 'public/widget.js'))) {
  console.error(`Not a One_AI_UI checkout: ${uiRepo}`)
  process.exit(1)
}

let sourceRef = 'unknown'
try {
  const sha = execSync('git rev-parse --short HEAD', { cwd: uiRepo }).toString().trim()
  const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: uiRepo }).toString().trim()
  sourceRef = `${branch}@${sha}`
} catch {
  /* not a git checkout -- fine */
}

const banner = `// VENDORED from One_AI_UI (${sourceRef}). Do not edit here -- change it in One_AI_UI, then run \`npm run widget:sync\`.\n`

for (const [from, to] of FILES) {
  const src = resolve(uiRepo, from)
  const dest = resolve(root, to)
  if (!existsSync(src)) {
    console.error(`Missing in One_AI_UI: ${from}`)
    process.exit(1)
  }
  mkdirSync(dirname(dest), { recursive: true })

  if (/\.tsx?$/.test(from)) {
    let text = readFileSync(src, 'utf8').replace(/(from\s+|import\(\s*)(['"])@\//g, `$1$2@/${VENDOR}/`)
    // 'use client' must stay the first statement.
    text = text.startsWith("'use client'") ? text.replace(/^('use client'\r?\n)/, `$1${banner}`) : banner + text
    writeFileSync(dest, text)
  } else {
    copyFileSync(src, dest)
  }
  console.log(`  ${from}  ->  ${to}`)
}
console.log(`\nSynced ${FILES.length} files from ${uiRepo} (${sourceRef})`)
