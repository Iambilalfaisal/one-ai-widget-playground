'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Check, ClipboardCopy, ExternalLink, RotateCcw, X } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CHECKLIST, ALL_ITEM_IDS } from '@/lib/checklist-data'
import { CHECKLIST_STORAGE_KEY } from '@/lib/config'
import { readJson, removeKey, writeJson } from '@/lib/storage'
import { cn } from '@/lib/utils'

type Result = 'pass' | 'fail'
type Entry = { result?: Result; note?: string }
type State = Record<string, Entry>

export function ChecklistView() {
  const [state, setState] = useState<State>({})
  const [loaded, setLoaded] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setState(readJson<State>(CHECKLIST_STORAGE_KEY) ?? {})
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) writeJson(CHECKLIST_STORAGE_KEY, state)
  }, [state, loaded])

  const counts = useMemo(() => {
    const values = ALL_ITEM_IDS.map(id => state[id]?.result)
    return {
      pass: values.filter(v => v === 'pass').length,
      fail: values.filter(v => v === 'fail').length,
      total: ALL_ITEM_IDS.length,
    }
  }, [state])

  const set = (id: string, patch: Entry) => setState(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  const toggleResult = (id: string, result: Result) => set(id, { result: state[id]?.result === result ? undefined : result })

  const reset = () => {
    if (!window.confirm('Clear all results and notes?')) return
    removeKey(CHECKLIST_STORAGE_KEY)
    setState({})
  }

  const copyReport = async () => {
    const lines: string[] = [`Widget test results — ${new Date().toLocaleString()}`, `Passed ${counts.pass} · Failed ${counts.fail} · Not tested ${counts.total - counts.pass - counts.fail}`, '']
    for (const group of CHECKLIST) {
      lines.push(`## ${group.title}`)
      for (const item of group.items) {
        const e = state[item.id]
        const mark = e?.result === 'pass' ? 'PASS' : e?.result === 'fail' ? 'FAIL' : 'NOT TESTED'
        lines.push(`- [${mark}] ${item.title}${e?.note ? ` — ${e.note}` : ''}`)
      }
      lines.push('')
    }
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable */
    }
  }

  const done = counts.pass + counts.fail
  const percent = Math.round((done / counts.total) * 100)

  return (
    <div className="space-y-6">
      <Card>
        <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center justify-between text-[13px]">
              <span className="font-medium text-zinc-800">{done} of {counts.total} checked</span>
              <span className="text-zinc-500">{counts.pass} passed · {counts.fail} failed</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
              <div className="flex h-full" style={{ width: `${percent}%` }}>
                <div className="bg-emerald-500" style={{ width: done ? `${(counts.pass / done) * 100}%` : 0 }} />
                <div className="bg-red-500" style={{ width: done ? `${(counts.fail / done) * 100}%` : 0 }} />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={copyReport}>
              <ClipboardCopy className="h-4 w-4" />
              {copied ? 'Copied' : 'Copy report'}
            </Button>
            <Button variant="ghost" onClick={reset}>
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>
        </CardBody>
      </Card>

      {CHECKLIST.map(group => (
        <section key={group.id} aria-labelledby={`g-${group.id}`}>
          <h2 id={`g-${group.id}`} className="text-lg font-semibold text-zinc-900">{group.title}</h2>
          <p className="mb-3 text-[13px] text-zinc-500">{group.description}</p>
          <div className="space-y-3">
            {group.items.map(item => {
              const entry = state[item.id] ?? {}
              return (
                <Card
                  key={item.id}
                  className={cn(entry.result === 'pass' && 'border-emerald-200', entry.result === 'fail' && 'border-red-200')}
                >
                  <CardBody className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="text-[14px] font-semibold text-zinc-900">{item.title}</h3>
                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          variant={entry.result === 'pass' ? 'primary' : 'secondary'}
                          className={entry.result === 'pass' ? 'bg-emerald-600 hover:bg-emerald-700' : undefined}
                          onClick={() => toggleResult(item.id, 'pass')}
                          aria-pressed={entry.result === 'pass'}
                        >
                          <Check className="h-3.5 w-3.5" /> Pass
                        </Button>
                        <Button
                          size="sm"
                          variant={entry.result === 'fail' ? 'primary' : 'secondary'}
                          className={entry.result === 'fail' ? 'bg-red-600 hover:bg-red-700' : undefined}
                          onClick={() => toggleResult(item.id, 'fail')}
                          aria-pressed={entry.result === 'fail'}
                        >
                          <X className="h-3.5 w-3.5" /> Fail
                        </Button>
                      </div>
                    </div>

                    {item.needs && (
                      <p className="flex items-start gap-2 text-[13px] text-amber-800">
                        <Badge tone="warning" className="shrink-0">Setup</Badge>
                        <span>{item.needs}</span>
                      </p>
                    )}

                    <ol className="list-decimal space-y-1 pl-5 text-[13px] text-zinc-700">
                      {item.steps.map((s, i) => <li key={i}>{s}</li>)}
                    </ol>

                    <p className="rounded-lg bg-zinc-50 px-3 py-2 text-[13px] text-zinc-700">
                      <span className="font-semibold text-zinc-900">Expected: </span>
                      {item.expected}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        value={entry.note ?? ''}
                        onChange={e => set(item.id, { note: e.target.value })}
                        placeholder="Notes (optional) — e.g. build, what you saw"
                        aria-label={`Notes for ${item.title}`}
                        className="h-9 min-w-0 flex-1 rounded-lg border border-zinc-200 px-3 text-[13px] focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                      />
                      {item.page && (
                        <Link
                          href={item.page.href}
                          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-violet-600 hover:underline"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> {item.page.label}
                        </Link>
                      )}
                    </div>
                  </CardBody>
                </Card>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
