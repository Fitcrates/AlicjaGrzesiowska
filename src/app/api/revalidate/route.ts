import { revalidatePath, revalidateTag } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'
import { NextRequest, NextResponse } from 'next/server'

import { locales } from '@/lib/i18n'
import {
  getSanityCacheTag,
  getSanityDocumentCacheTag,
  sanityCacheTags,
} from '@/sanity/lib/client'
import { sanitySchemaTypeNames } from '@/sanity/schemas'

type SanityWebhookPayload = {
  _id?: string
  _type?: string
  slug?: string | { current?: string }
}

export const runtime = 'nodejs'

function getSlug(payload: SanityWebhookPayload | null) {
  if (!payload?.slug) return undefined
  return typeof payload.slug === 'string' ? payload.slug : payload.slug.current
}

function getTags(payload: SanityWebhookPayload | null) {
  const tags = new Set<string>([sanityCacheTags.all])

  if (payload?._type && sanitySchemaTypeNames.some((typeName) => typeName === payload?._type)) {
    tags.add(getSanityCacheTag(payload._type))
  }

  if (payload?._id) {
    tags.add(getSanityDocumentCacheTag(payload._id))
  }

  return Array.from(tags)
}

function revalidateAllPaths(slug?: string) {
  revalidatePath('/', 'layout')

  for (const locale of locales) {
    revalidatePath(`/${locale}`)
    revalidatePath(`/${locale}/about`)
    revalidatePath(`/${locale}/case/[slug]`, 'page')

    if (slug) {
      revalidatePath(`/${locale}/case/${slug}`)
    }
  }
}

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET

  if (!secret) {
    return NextResponse.json(
      { revalidated: false, message: 'Missing SANITY_REVALIDATE_SECRET' },
      { status: 500 }
    )
  }

  let payload: SanityWebhookPayload | null = null

  try {
    const parsed = await parseBody<SanityWebhookPayload>(request, secret)

    if (parsed.isValidSignature !== true) {
      return NextResponse.json(
        { revalidated: false, message: 'Invalid Sanity webhook signature' },
        { status: 401 }
      )
    }

    payload = parsed.body
  } catch {
    return NextResponse.json(
      { revalidated: false, message: 'Invalid Sanity webhook payload' },
      { status: 400 }
    )
  }

  const tags = getTags(payload)
  const slug = getSlug(payload)

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 })
  }

  revalidateAllPaths(slug)

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
    document: {
      id: payload?._id,
      type: payload?._type,
      slug,
    },
    tags,
  })
}
