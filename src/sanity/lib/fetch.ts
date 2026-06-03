import 'server-only'

import type { QueryParams } from 'next-sanity'
import { client } from './client'
import { sanityLiveFetch } from './live'

const DEFAULT_PARAMS = {} as QueryParams
const DEFAULT_TAGS = [] as string[]

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
    tags,
  })

  return data as QueryResponse
}

export async function sanityStaticFetch<QueryResponse>({
  query,
  params = DEFAULT_PARAMS,
}: {
  query: string
  params?: QueryParams
}): Promise<QueryResponse> {
  return client
    .withConfig({
      perspective: 'published',
      stega: false,
      useCdn: true,
    })
    .fetch<QueryResponse>(query, params, {
      cache: 'force-cache',
    })
}
