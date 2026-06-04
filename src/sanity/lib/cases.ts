import 'server-only'

import { cases as fallbackCases, type CaseStudy } from '@/lib/cases'
import { allCaseSlugsQuery, caseStudyBySlugQuery } from './queries'
import { sanityFetch, sanityStaticFetch } from './fetch'
import { sanityCacheTags } from './client'

export async function getCaseBySlug(
  slug: string,
  locale: string = 'en'
): Promise<CaseStudy | undefined> {
  const result = await sanityFetch<CaseStudy | null>({
    query: caseStudyBySlugQuery,
    params: { slug, lang: locale },
    tags: [sanityCacheTags.caseStudy],
  })

  return result || fallbackCases.find((item) => item.slug === slug)
}

export async function getAllSlugs(): Promise<string[]> {
  const sanityCases = await sanityStaticFetch<Array<{ slug: string }> | null>({
    query: allCaseSlugsQuery,
    params: {},
    tags: [sanityCacheTags.caseStudy],
  })

  if (sanityCases?.length) {
    return sanityCases.map((item) => item.slug)
  }

  return fallbackCases.map((item) => item.slug)
}
