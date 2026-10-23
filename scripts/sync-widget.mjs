// Copies the canonical widget loader from the One_AI_UI repo into public/widget.js.
// Usage: npm run widget:sync   (expects One_AI_UI checked out next to this repo,
// or pass a path: node scripts/sync-widget.mjs ../path/to/One_AI_UI)
import { copyFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const uiRepo = resolve(root, process.argv[2] ?? '../One_AI_UI')
const source = resolve(uiRepo, 'public/widget.js')
const target = resolve(root, 'public/widget.js')

if (!existsSync(source)) {
  console.error(`widget.js not found at ${source}`)
  process.exit(1)
}
copyFileSync(source, target)
console.log(`Synced widget.js\n  from ${source}\n  to   ${target}`)
