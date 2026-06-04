import { createClient } from 'next-sanity'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'acuukn8a'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-02-01'
export const sanityCacheTags = {
  all: 'sanity',
  homePage: 'sanity:homePage',
  aboutPage: 'sanity:aboutPage',
  caseStudy: 'sanity:caseStudy',
  challenge: 'sanity:challenge',
  investigationCard: 'sanity:investigationCard',
}

export const studioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ||
  'https://alicja-portfolio.sanity.studio'

export function getSanityCacheTag(type?: string) {
  return type ? `sanity:${type}` : sanityCacheTags.all
}

export function getSanityDocumentCacheTag(id?: string) {
  return id ? `sanity:${id}` : sanityCacheTags.all
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: {
    studioUrl,
  },
})
