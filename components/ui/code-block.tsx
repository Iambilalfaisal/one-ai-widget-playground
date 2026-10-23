'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable -- the block is still selectable by hand */
    }
  }

  return (
    <div className="relative">
      <pre className="max-h-[420px] overflow-auto rounded-lg border border-zinc-200 bg-zinc-950 p-4 pr-24 font-mono text-[12px] leading-relaxed text-zinc-100">
        {code}
      </pre>
      <Button size="sm" variant="secondary" className="absolute right-2 top-2" onClick={copy}>
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy'}
      </Button>
    </div>
  )
}
