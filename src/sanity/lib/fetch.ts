import 'server-only'

import type { QueryParams } from 'next-sanity'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import { cookies, draftMode, headers } from 'next/headers'
import {
  resolvePerspectiveFromCookies,
  type LivePerspective,
} from 'next-sanity/live'
import { client, sanityCacheTags } from './client'
import { sanityLiveFetch } from './live'
import {
  SANITY_PREVIEW_HEADER,
  SANITY_PREVIEW_PERSPECTIVE_HEADER,
} from '../preview'

const DEFAULT_PARAMS = {} as QueryParams
const DEFAULT_TAGS = [sanityCacheTags.all]

function resolveTags(tags: string[]) {
  return Array.from(new Set([...DEFAULT_TAGS, ...tags]))
}

function resolveHeaderPerspective(value: string | null): LivePerspective {
  return value && value !== 'raw' ? (value as LivePerspective) : 'drafts'
}

async function resolveLiveFetchOptions(): Promise<{
  perspective: LivePerspective
  stega: boolean
}> {
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    return { perspective: 'published', stega: false }
  }

  const [{ isEnabled }, headerStore] = await Promise.all([draftMode(), headers()])
  const headerPerspective = headerStore.get(SANITY_PREVIEW_PERSPECTIVE_HEADER)
  const hasPreviewHeader = headerStore.get(SANITY_PREVIEW_HEADER) === '1'

  if (!isEnabled && !hasPreviewHeader && !headerPerspective) {
    return { perspective: 'published', stega: false }
  }

  const perspective =
    headerPerspective
      ? resolveHeaderPerspective(headerPerspective)
      : (await resolvePerspectiveFromCookies({ cookies: await cookies() })) ??
    'drafts'

  return { perspective, stega: true }
}

export async function sanityFetch<QueryResponse>({
  query,
  params = DEFAULT_PARAMS,
  tags = DEFAULT_TAGS,
}: {
  query: string
  params?: QueryParams
  tags?: string[]
}): Promise<QueryResponse> {
  const { data } = await sanityLiveFetch({
    query,
    params,
    tags: resolveTags(tags),
    ...(await resolveLiveFetchOptions()),
  })

  return data as QueryResponse
}

export async function sanityStaticFetch<QueryResponse>({
  query,
  params = DEFAULT_PARAMS,
  tags = DEFAULT_TAGS,
}: {
  query: string
  params?: QueryParams
  tags?: string[]
}): Promise<QueryResponse> {
  return client
    .withConfig({
      perspective: 'published',
      stega: false,
      useCdn: true,
    })
    .fetch<QueryResponse>(query, params, {
      cache: 'force-cache',
      next: {
        tags: resolveTags(tags),
      },
    })
}
