import 'server-only'

import type { QueryParams } from 'next-sanity'
import { client, sanityCacheTags } from './client'
import { sanityLiveFetch } from './live'

const DEFAULT_PARAMS = {} as QueryParams
const DEFAULT_TAGS = [sanityCacheTags.all]

function resolveTags(tags: string[]) {
  return Array.from(new Set([...DEFAULT_TAGS, ...tags]))
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
