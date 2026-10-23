import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/layout/page-hero'
import { TestNote } from '@/components/layout/test-note'
import { Card, CardBody } from '@/components/ui/card'
import { PRODUCTS } from '@/lib/site-content'

export const metadata: Metadata = { title: 'Products' }

export default function ProductsPage() {
  return (
    <>
      <PageHero eyebrow="Products" title="Everything your team needs to ship" description="Three products that work great alone and even better together." />
      <TestNote>
        <p>
          Page-targeted greetings: add a greeting with path pattern <code>/products*</code> in the dashboard. It should
          appear on this page <em>and</em> on each product page below, but not on Home, Pricing or Support.
        </p>
      </TestNote>
      <div className="mx-auto grid max-w-6xl gap-5 px-5 py-10 md:grid-cols-3">
        {PRODUCTS.map(p => (
          <Card key={p.slug}>
            <CardBody className="flex h-full flex-col">
              <h2 className="text-lg font-semibold text-zinc-900">{p.name}</h2>
              <p className="mt-1 text-[13px] font-medium text-violet-700">{p.tagline}</p>
              <p className="mt-3 flex-1 text-[13px] leading-relaxed text-zinc-600">{p.description}</p>
              <Link href={`/products/${p.slug}`} className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-violet-600 hover:underline">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardBody>
          </Card>
        ))}
      </div>
    </>
  )
}
