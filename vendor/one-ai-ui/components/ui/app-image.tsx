// VENDORED from One_AI_UI (dev-bilal@fac19b1). Do not edit here -- change it in One_AI_UI, then run `npm run widget:sync`.
import Image from 'next/image'
import { API_BASE_URL } from '@/vendor/one-ai-ui/lib/config'

/**
 * Image wrapper that keeps Next.js image optimization (resizing, WebP, lazy
 * loading) on for everything that can use it, and scopes the exceptions to
 * the specific sources below. Prefer this over a raw <img>.
 *
 *  - optimized:   local `/public` paths and the backend's `/media/**` uploads
 *                 (must match `images.remotePatterns` in next.config.mjs).
 *  - unoptimized: `blob:`/`data:` previews (nothing to fetch) and DiceBear
 *                 fallback avatars, which are SVG -- vector, so resizing and
 *                 re-encoding gain nothing and the optimizer rejects SVG.
 *  - plain <img>: any other absolute URL. Widget branding accepts arbitrary
 *                 customer URLs, and allow-listing "any host" would turn
 *                 /_next/image into an open image proxy. Still lazy-loaded.
 */

const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin
  } catch {
    return null
  }
})()
const SVG_ORIGINS = new Set(['https://api.dicebear.com'])

type Strategy = 'optimize' | 'unoptimized' | 'native'

function pickStrategy(src: string): Strategy {
  if (src.startsWith('blob:') || src.startsWith('data:')) return 'unoptimized'
  if (src.startsWith('/') && !src.startsWith('//')) return 'optimize'
  try {
    const url = new URL(src)
    if (SVG_ORIGINS.has(url.origin)) return 'unoptimized'
    if (url.origin === API_ORIGIN && url.pathname.startsWith('/media/') && !url.search) return 'optimize'
  } catch {
    // Not a parseable URL -- fall through to the plain <img>.
  }
  return 'native'
}

export interface AppImageProps {
  src?: string | null
  alt: string
  /** Intrinsic size hint used for the aspect ratio and the generated srcset. */
  width: number
  height: number
  className?: string
  sizes?: string
  onError?: React.ReactEventHandler<HTMLImageElement>
}

export function AppImage({ src, alt, width, height, className, sizes, onError }: AppImageProps) {
  if (!src) return null

  const strategy = pickStrategy(src)
  if (strategy === 'native') {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- arbitrary third-party host, see file header
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading="lazy"
        decoding="async"
        onError={onError}
        className={className}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      unoptimized={strategy === 'unoptimized'}
      onError={onError}
      className={className}
    />
  )
}
