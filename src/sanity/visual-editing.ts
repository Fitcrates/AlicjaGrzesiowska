import { createDataAttribute, type CreateDataAttributeProps } from 'next-sanity'

import type { Locale } from '@/lib/i18n'
import { dataset, projectId, studioUrl } from '@/sanity/lib/client'

export type SanityPath = NonNullable<CreateDataAttributeProps['path']>
type PathSegment = string | number | { _key: string }

function isPathArray(path: SanityPath): path is PathSegment[] {
  return Array.isArray(path)
}

export function localizedSanityPath(locale: Locale, path: SanityPath) {
  return isPathArray(path) ? [locale, ...path] : [locale, path]
}

export function keyedPath(key: string | undefined, fallbackIndex: number) {
  return key ? [{ _key: key }] : [fallbackIndex]
}

export function sanityDataAttribute({
  id,
  path,
  type,
}: {
  id?: string
  path: SanityPath
  type?: string
}) {
  if (!id || !type) return undefined

  return createDataAttribute({
    baseUrl: studioUrl,
    dataset,
    id,
    path,
    projectId,
    type,
  }).toString()
}
