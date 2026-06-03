import { defineLive } from 'next-sanity/live'

import { apiVersion, client } from './client'

const serverToken = process.env.SANITY_API_READ_TOKEN
const browserToken = process.env.NEXT_PUBLIC_SANITY_BROWSER_READ_TOKEN || false

export const { sanityFetch: sanityLiveFetch, SanityLive } = defineLive({
  client: client.withConfig({ apiVersion }),
  serverToken,
  browserToken,
})
