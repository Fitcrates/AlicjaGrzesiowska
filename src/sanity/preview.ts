import { draftMode, headers } from 'next/headers'

export const SANITY_PREVIEW_HEADER = 'x-sanity-presentation-preview'
export const SANITY_PREVIEW_PERSPECTIVE_HEADER = 'x-sanity-preview-perspective'

export async function isSanityPreviewRequest() {
  const [{ isEnabled }, headerStore] = await Promise.all([draftMode(), headers()])

  return isEnabled || headerStore.get(SANITY_PREVIEW_HEADER) === '1'
}
