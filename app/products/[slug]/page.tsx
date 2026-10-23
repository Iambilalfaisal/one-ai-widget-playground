import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import { PageHero } from '@/components/layout/page-hero'
import { PRODUCTS } from '@/lib/site-content'

export function generateStaticParams() {
  return PRODUCTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = PRODUCTS.find(p => p.slug === slug)
  return { title: product?.name ?? 'Product' }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = PRODUCTS.find(p => p.slug === slug)
  if (!product) notFound()

  return (
    <>
      <PageHero eyebrow="Product" title={product.name} description={product.tagline}>
        <Link href="/products" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-violet-600 hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> All products
        </Link>
      </PageHero>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[3fr_2fr]">
        <p className="text-base leading-relaxed text-zinc-700">{product.description}</p>
        <ul className="space-y-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          {product.features.map(f => (
            <li key={f} className="flex items-center gap-2.5 text-[14px] text-zinc-800">
              <Check className="h-4 w-4 text-emerald-600" /> {f}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
